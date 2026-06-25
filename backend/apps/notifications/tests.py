from django.test import TestCase
from unittest.mock import patch

from apps.accounts.models import User
from apps.applications.models import Application
from apps.jobs.models import Department, JobOffer
from apps.notifications.services import notify_application_status
from apps.notifications.models import NotificationLog


class NotificationTests(TestCase):
    def setUp(self):
        dept = Department.objects.create(name='Commercial')
        job = JobOffer.objects.create(
            department=dept, title='Commercial', description='Vente',
            required_skills=['vente'], min_experience=1, location='Kinshasa',
            deadline='2026-12-31',
        )
        candidate = User.objects.create_user(
            username='c1', email='c1@test.cd', password='test12345',
            first_name='Jean', last_name='Test', phone='+243900000001',
            role=User.Role.CANDIDAT,
        )
        self.application = Application.objects.create(
            candidate=candidate, job_offer=job,
            cv_file='cvs/demo/test.pdf', cv_text='commercial vente kinshasa',
            consent_given=True,
        )

    @patch('apps.notifications.services.send_mail')
    def test_email_notification_sent(self, mock_send):
        notify_application_status(self.application, 'recu')
        self.assertTrue(mock_send.called)
        log = NotificationLog.objects.filter(channel='email').first()
        self.assertEqual(log.status, NotificationLog.Status.SENT)

    def test_sms_notification_dev_mode(self):
        notify_application_status(self.application, 'recu')
        log = NotificationLog.objects.filter(channel='sms').first()
        self.assertIsNotNone(log)
        self.assertEqual(log.status, NotificationLog.Status.SENT)
