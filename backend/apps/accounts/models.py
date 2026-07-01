import os
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


def profile_cv_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    return f'profile_cvs/{instance.user_id}/{uuid.uuid4()}{ext}'


class User(AbstractUser):
    class Role(models.TextChoices):
        CANDIDAT = 'candidat', 'Candidat'
        RECRUTEUR = 'recruteur', 'Recruteur RH'
        ADMIN = 'admin', 'Administrateur RH'

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CANDIDAT)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return f'{self.get_full_name()} ({self.email})'

    @property
    def is_recruiter(self):
        return self.role in (self.Role.RECRUTEUR, self.Role.ADMIN)

    @property
    def is_admin_rh(self):
        return self.role == self.Role.ADMIN


class CandidateProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='candidate_profile',
    )
    diplome = models.CharField(max_length=200, blank=True, verbose_name='Diplôme')
    field_of_study = models.CharField(max_length=200, blank=True, verbose_name='Domaine d\'études')
    years_experience = models.PositiveIntegerField(default=0, verbose_name='Années d\'expérience')
    current_position = models.CharField(max_length=200, blank=True, verbose_name='Poste actuel')
    linkedin = models.URLField(blank=True)
    bio = models.TextField(blank=True, verbose_name='Résumé / bio')
    cv_file = models.FileField(upload_to=profile_cv_upload_path, blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Profil de {self.user.get_full_name()}'

    @property
    def profile_complete(self):
        return bool(
            self.diplome and self.field_of_study and self.cv_file
        )
