from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated

from apps.accounts.views import IsRecruiter
from .models import NotificationLog


class NotificationLogSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(
        source='application.candidate.get_full_name', read_only=True
    )
    job_title = serializers.CharField(source='application.job_offer.title', read_only=True)

    class Meta:
        model = NotificationLog
        fields = (
            'id', 'application', 'channel', 'recipient', 'template_name',
            'status', 'error_message', 'sent_at', 'created_at',
            'candidate_name', 'job_title',
        )


class NotificationLogListView(generics.ListAPIView):
    serializer_class = NotificationLogSerializer
    permission_classes = (IsAuthenticated, IsRecruiter)

    def get_queryset(self):
        qs = NotificationLog.objects.select_related(
            'application__candidate', 'application__job_offer'
        ).all()
        application_id = self.request.query_params.get('application')
        if application_id:
            qs = qs.filter(application_id=application_id)
        return qs
