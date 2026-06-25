from django.db import models


class NotificationLog(models.Model):
    class Channel(models.TextChoices):
        EMAIL = 'email', 'E-mail'
        SMS = 'sms', 'SMS'

    class Status(models.TextChoices):
        PENDING = 'pending', 'En attente'
        SENT = 'sent', 'Envoyé'
        FAILED = 'failed', 'Échoué'

    application = models.ForeignKey(
        'applications.Application',
        on_delete=models.CASCADE,
        related_name='notification_logs',
    )
    channel = models.CharField(max_length=10, choices=Channel.choices)
    recipient = models.CharField(max_length=255)
    template_name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    error_message = models.TextField(blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.channel} → {self.recipient} ({self.status})'
