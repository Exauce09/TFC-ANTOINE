from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Application


@receiver(post_save, sender=Application)
def notify_on_application_created(sender, instance, created, **kwargs):
    if created:
        from apps.notifications.tasks import send_status_notification
        send_status_notification.delay(instance.id, Application.Status.RECU)
