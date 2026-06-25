from rest_framework import viewsets, permissions
from django.utils import timezone

from apps.accounts.views import IsRecruiter
from .models import Department, JobOffer
from .serializers import DepartmentSerializer, JobOfferListSerializer, JobOfferSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [IsRecruiter()]


class JobOfferViewSet(viewsets.ModelViewSet):
    queryset = JobOffer.objects.select_related('department').all()
    serializer_class = JobOfferSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [IsRecruiter()]

    def get_serializer_class(self):
        if self.action == 'list' and not self.request.user.is_authenticated:
            return JobOfferListSerializer
        if self.action == 'list':
            user = self.request.user
            if not getattr(user, 'is_recruiter', False):
                return JobOfferListSerializer
        return JobOfferSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.query_params.get('status')
        department = self.request.query_params.get('department')

        if status:
            qs = qs.filter(status=status)
        elif not self.request.user.is_authenticated or not getattr(self.request.user, 'is_recruiter', False):
            qs = qs.filter(status=JobOffer.Status.ACTIVE, deadline__gte=timezone.now().date())

        if department:
            qs = qs.filter(department_id=department)

        return qs
