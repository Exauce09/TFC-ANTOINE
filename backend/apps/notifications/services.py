from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone

import requests

from .models import NotificationLog

TEMPLATES = {
    'recu': {
        'email_subject': 'Candidature reçue — {company}',
        'email_template': 'notifications/email/recu.html',
        'sms': 'Maison Galaxy: Votre candidature pour "{job}" est bien reçue. Dossier #{id}.',
    },
    'en_analyse': {
        'email_subject': 'Candidature en cours d\'analyse — {company}',
        'email_template': 'notifications/email/en_analyse.html',
        'sms': None,
    },
    'shortlist': {
        'email_subject': 'Félicitations — Shortlist — {company}',
        'email_template': 'notifications/email/shortlist.html',
        'sms': 'Maison Galaxy: Félicitations! Vous êtes shortlisté pour "{job}". Consultez votre e-mail.',
    },
    'refuse': {
        'email_subject': 'Suite à votre candidature — {company}',
        'email_template': 'notifications/email/refuse.html',
        'sms': 'Maison Galaxy: Merci pour votre candidature "{job}". Nous ne donnons pas suite pour ce poste.',
    },
    'convocation': {
        'email_subject': 'Convocation entretien — {company}',
        'email_template': 'notifications/email/convocation.html',
        'sms': 'Maison Galaxy: Convocation entretien pour "{job}". Consultez votre e-mail pour les détails.',
    },
}


def _build_context(application):
    return {
        'company': settings.SIGER_COMPANY_NAME,
        'candidate_name': application.candidate.get_full_name(),
        'job_title': application.job_offer.title,
        'application_id': application.id,
        'interview_date': application.interview_date,
        'interview_location': application.interview_location,
        'interview_contact': application.interview_contact,
    }


def send_email_notification(application, status_key: str) -> NotificationLog:
    template = TEMPLATES.get(status_key, TEMPLATES['recu'])
    context = _build_context(application)
    log = NotificationLog.objects.create(
        application=application,
        channel=NotificationLog.Channel.EMAIL,
        recipient=application.candidate.email,
        template_name=status_key,
    )

    try:
        subject = template['email_subject'].format(company=settings.SIGER_COMPANY_NAME)
        html_message = render_to_string(template['email_template'], context)
        send_mail(
            subject=subject,
            message='',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[application.candidate.email],
            html_message=html_message,
            fail_silently=False,
        )
        log.status = NotificationLog.Status.SENT
        log.sent_at = timezone.now()
        log.save()
    except Exception as exc:
        log.status = NotificationLog.Status.FAILED
        log.error_message = str(exc)
        log.save()

    return log


def send_sms_notification(application, status_key: str) -> NotificationLog | None:
    template = TEMPLATES.get(status_key, TEMPLATES['recu'])
    sms_text = template.get('sms')
    phone = application.candidate.phone

    if not sms_text or not phone:
        return None

    log = NotificationLog.objects.create(
        application=application,
        channel=NotificationLog.Channel.SMS,
        recipient=phone,
        template_name=status_key,
    )

    message = sms_text.format(
        job=application.job_offer.title,
        id=application.id,
        company=settings.SIGER_COMPANY_NAME,
    )

    try:
        if settings.AFRICASTALKING_API_KEY:
            response = requests.post(
                'https://api.africastalking.com/version1/messaging',
                headers={
                    'apiKey': settings.AFRICASTALKING_API_KEY,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
                data={
                    'username': settings.AFRICASTALKING_USERNAME,
                    'to': phone,
                    'message': message,
                    'from': settings.AFRICASTALKING_SENDER,
                },
                timeout=30,
            )
            response.raise_for_status()
        else:
            print(f'[SMS DEV] To: {phone} | {message}')

        log.status = NotificationLog.Status.SENT
        log.sent_at = timezone.now()
        log.save()
    except Exception as exc:
        log.status = NotificationLog.Status.FAILED
        log.error_message = str(exc)
        log.save()

    return log


def notify_application_status(application, status_key: str):
    send_email_notification(application, status_key)
    send_sms_notification(application, status_key)
