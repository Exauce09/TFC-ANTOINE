from celery import shared_task

from apps.applications.models import Application

from .services import notify_application_status


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_status_notification(self, application_id: int, status_key: str):
    try:
        application = Application.objects.select_related(
            'candidate', 'job_offer'
        ).get(pk=application_id)
        notify_application_status(application, status_key)
    except Application.DoesNotExist:
        return
    except Exception as exc:
        raise self.retry(exc=exc)
