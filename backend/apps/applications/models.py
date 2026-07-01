import os
import uuid

from django.conf import settings
from django.db import models


def cv_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    return f'cvs/{instance.job_offer_id}/{uuid.uuid4()}{ext}'


class Application(models.Model):
    class Status(models.TextChoices):
        RECU = 'recu', 'Reçu'
        EN_ANALYSE = 'en_analyse', 'En analyse'
        SHORTLIST = 'shortlist', 'Shortlist'
        REFUSE = 'refuse', 'Refusé'
        CONVOCATION = 'convocation', 'Convocation'

    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications',
    )
    job_offer = models.ForeignKey(
        'jobs.JobOffer',
        on_delete=models.CASCADE,
        related_name='applications',
    )
    cv_file = models.FileField(upload_to=cv_upload_path, blank=True)
    cover_letter = models.TextField(blank=True)
    motivation_answers = models.JSONField(default=dict, blank=True)
    availability_date = models.DateField(null=True, blank=True)
    cv_text = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.RECU)
    auto_score = models.FloatField(null=True, blank=True)
    final_score = models.FloatField(null=True, blank=True)
    score_details = models.JSONField(default=dict, blank=True)
    consent_given = models.BooleanField(default=False)
    interview_date = models.DateTimeField(null=True, blank=True)
    interview_location = models.CharField(max_length=300, blank=True)
    interview_contact = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-auto_score', '-created_at']
        unique_together = ('candidate', 'job_offer')

    def __str__(self):
        return f'{self.candidate} → {self.job_offer.title}'

    @property
    def display_score(self):
        return self.final_score if self.final_score is not None else self.auto_score

    @property
    def score_recommendation(self):
        score = self.display_score
        if score is None:
            return 'pending'
        if score >= settings.SIGER_SHORTLIST_THRESHOLD:
            return 'shortlist'
        if score >= settings.SIGER_MANUAL_REVIEW_THRESHOLD:
            return 'manual_review'
        return 'reject_suggested'


class AuditLog(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='audit_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)
    details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.action} — {self.application_id}'
