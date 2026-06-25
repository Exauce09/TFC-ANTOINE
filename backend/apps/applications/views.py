import csv

from django.http import HttpResponse
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.views import IsRecruiter
from apps.scoring.engine import score_application
from apps.scoring.parser import extract_text_from_cv
from .models import Application, AuditLog
from .serializers import (
    ApplicationCreateSerializer,
    ApplicationSerializer,
    ApplicationStatusUpdateSerializer,
)


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.select_related('candidate', 'job_offer').all()
    serializer_class = ApplicationSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self):
        if self.action == 'create':
            return ApplicationCreateSerializer
        if self.action == 'update_status':
            return ApplicationStatusUpdateSerializer
        return ApplicationSerializer

    def get_permissions(self):
        if self.action in ('update_status', 'export_csv', 'partial_update', 'update', 'destroy'):
            return [IsRecruiter()]
        return super().get_permissions()

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        job_offer = self.request.query_params.get('job_offer')
        status_filter = self.request.query_params.get('status')

        if not user.is_recruiter:
            qs = qs.filter(candidate=user)
        elif job_offer:
            qs = qs.filter(job_offer_id=job_offer)

        if status_filter:
            qs = qs.filter(status=status_filter)

        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        job_offer = serializer.validated_data['job_offer']
        if Application.objects.filter(candidate=request.user, job_offer=job_offer).exists():
            return Response(
                {'detail': 'Vous avez déjà postulé à cette offre.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        application = serializer.save(candidate=request.user, status=Application.Status.RECU)

        try:
            cv_text = extract_text_from_cv(application.cv_file.path)
            application.cv_text = cv_text
            score_result = score_application(application.job_offer, cv_text, application.cover_letter)
            application.auto_score = score_result['final_score']
            application.score_details = score_result
            application.status = Application.Status.EN_ANALYSE
            application.save()
        except Exception as exc:
            application.score_details = {'error': str(exc)}
            application.save()

        return Response(
            ApplicationSerializer(application, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        application = self.get_object()
        serializer = ApplicationStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = application.status
        new_status = serializer.validated_data['status']
        application.status = new_status

        if 'final_score' in serializer.validated_data:
            application.final_score = serializer.validated_data['final_score']
        if 'interview_date' in serializer.validated_data:
            application.interview_date = serializer.validated_data['interview_date']
        if 'interview_location' in serializer.validated_data:
            application.interview_location = serializer.validated_data['interview_location']
        if 'interview_contact' in serializer.validated_data:
            application.interview_contact = serializer.validated_data['interview_contact']

        application.save()

        AuditLog.objects.create(
            application=application,
            user=request.user,
            action='status_change',
            details={'from': old_status, 'to': new_status},
        )

        from apps.notifications.tasks import send_status_notification
        send_status_notification.delay(application.id, new_status)

        return Response(ApplicationSerializer(application).data)

    @action(detail=False, methods=['get'], url_path='export-csv')
    def export_csv(self, request):
        job_offer_id = request.query_params.get('job_offer')
        if not job_offer_id:
            return Response({'detail': 'Paramètre job_offer requis.'}, status=400)

        applications = self.get_queryset().filter(job_offer_id=job_offer_id)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="candidatures_{job_offer_id}.csv"'
        response.write('\ufeff')

        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Nom', 'Email', 'Téléphone', 'Statut', 'Score auto', 'Score final',
            'Recommandation', 'Date candidature',
        ])

        for app in applications:
            writer.writerow([
                app.id,
                app.candidate.get_full_name(),
                app.candidate.email,
                app.candidate.phone,
                app.get_status_display(),
                app.auto_score or '',
                app.final_score or '',
                app.score_recommendation,
                app.created_at.strftime('%Y-%m-%d %H:%M'),
            ])

        return response
