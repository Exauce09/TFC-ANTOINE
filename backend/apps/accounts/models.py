from django.contrib.auth.models import AbstractUser
from django.db import models


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
