import os
import uuid

from django.db import models


def job_image_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1].lower()
    return f'jobs/{uuid.uuid4()}{ext}'


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class JobOffer(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Brouillon'
        ACTIVE = 'active', 'Active'
        CLOSED = 'closed', 'Clôturée'

    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='job_offers')
    title = models.CharField(max_length=200)
    description = models.TextField()
    required_skills = models.JSONField(default=list, help_text='Liste de compétences requises')
    min_experience = models.PositiveIntegerField(default=0, help_text='Années d\'expérience minimum')
    required_degree = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=100, default='Kinshasa')
    deadline = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    image_key = models.CharField(
        max_length=50,
        blank=True,
        help_text='Clé image frontend (commercial, logistique, it, etc.)',
    )
    image = models.FileField(upload_to=job_image_upload_path, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} — {self.department.name}'
