from django.db.models import Avg, Count
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.views import IsRecruiter
from apps.applications.models import Application
from apps.jobs.models import JobOffer
from apps.notifications.models import NotificationLog


class ReportSummaryView(APIView):
    permission_classes = (IsRecruiter,)

    def get(self, request):
        job_offer_id = request.query_params.get('job_offer')

        applications = Application.objects.all()
        jobs = JobOffer.objects.all()

        if job_offer_id:
            applications = applications.filter(job_offer_id=job_offer_id)

        status_counts = dict(
            applications.values('status').annotate(count=Count('id')).values_list('status', 'count')
        )

        avg_score = applications.aggregate(avg=Avg('auto_score'))['avg'] or 0

        by_job = list(
            applications.values('job_offer__title')
            .annotate(count=Count('id'), avg_score=Avg('auto_score'))
            .order_by('-count')[:10]
        )

        notifications_sent = NotificationLog.objects.filter(status=NotificationLog.Status.SENT).count()
        notifications_failed = NotificationLog.objects.filter(status=NotificationLog.Status.FAILED).count()

        conversion = 0
        total = applications.count()
        if total:
            shortlisted = applications.filter(status__in=[
                Application.Status.SHORTLIST,
                Application.Status.CONVOCATION,
            ]).count()
            conversion = round((shortlisted / total) * 100, 1)

        return Response({
            'total_applications': total,
            'total_jobs': jobs.count(),
            'active_jobs': jobs.filter(
                status=JobOffer.Status.ACTIVE,
                deadline__gte=timezone.now().date(),
            ).count(),
            'status_counts': status_counts,
            'average_score': round(avg_score, 1),
            'conversion_rate': conversion,
            'applications_by_job': by_job,
            'notifications_sent': notifications_sent,
            'notifications_failed': notifications_failed,
        })
