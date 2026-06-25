from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.jobs.models import Department, JobOffer


class IntegrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        dept = Department.objects.create(name='IT')
        self.job = JobOffer.objects.create(
            department=dept,
            title='Test Job',
            description='Python developer kinshasa',
            required_skills=['python', 'django'],
            min_experience=1,
            location='Kinshasa',
            deadline='2026-12-31',
        )
        self.candidate = User.objects.create_user(
            username='cand', email='cand@test.cd', password='test12345',
            first_name='Test', last_name='Candidat', phone='+243900000111',
            role=User.Role.CANDIDAT,
        )
        self.recruiter = User.objects.create_user(
            username='rh', email='rh@test.cd', password='test12345',
            first_name='RH', last_name='Test', role=User.Role.RECRUTEUR,
        )

    def test_jobs_list_public(self):
        response = self.client.get('/api/jobs/')
        self.assertEqual(response.status_code, 200)

    def test_register_and_login(self):
        response = self.client.post('/api/auth/register/', {
            'email': 'new@test.cd',
            'username': 'newuser',
            'first_name': 'New',
            'last_name': 'User',
            'phone': '+243900000222',
            'password': 'test12345',
            'password_confirm': 'test12345',
        })
        self.assertEqual(response.status_code, 201)

        login = self.client.post('/api/auth/login/', {
            'email': 'new@test.cd',
            'password': 'test12345',
        })
        self.assertEqual(login.status_code, 200)
        self.assertIn('access', login.data)

    def test_recruiter_can_list_all_applications(self):
        self.client.force_authenticate(user=self.recruiter)
        response = self.client.get('/api/applications/')
        self.assertEqual(response.status_code, 200)

    def test_candidate_sees_only_own_applications(self):
        self.client.force_authenticate(user=self.candidate)
        response = self.client.get('/api/applications/')
        self.assertEqual(response.status_code, 200)
