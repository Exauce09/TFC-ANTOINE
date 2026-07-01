from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from apps.accounts.models import User
from apps.jobs.models import Department, JobOffer
from apps.applications.models import Application
from apps.scoring.engine import score_application


SAMPLE_CVS = [
    {
        'email': 'jean.mutombo@email.cd',
        'first_name': 'Jean', 'last_name': 'Mutombo', 'phone': '+243900000001',
        'cv': 'commercial kinshasa 5 ans experience vente prospection negociation crm licence commerce b2b',
    },
    {
        'email': 'marie.kabila@email.cd',
        'first_name': 'Marie', 'last_name': 'Kabila', 'phone': '+243900000002',
        'cv': 'infirmiere hopital 1 an experience soins patients',
    },
    {
        'email': 'paul.lumumba@email.cd',
        'first_name': 'Paul', 'last_name': 'Lumumba', 'phone': '+243900000003',
        'cv': 'assistant commercial kinshasa 2 ans vente detail graduat commerce',
    },
    {
        'email': 'grace.mukendi@email.cd',
        'first_name': 'Grace', 'last_name': 'Mukendi', 'phone': '+243900000004',
        'cv': 'logisticienne kinshasa 4 ans gestion stock inventaire supply chain bac+3',
    },
    {
        'email': 'david.tshisekedi@email.cd',
        'first_name': 'David', 'last_name': 'Tshisekedi', 'phone': '+243900000005',
        'cv': 'developpeur web python django react 3 ans experience licence informatique kinshasa',
    },
]


class Command(BaseCommand):
    help = 'Charge les données de démonstration Maison Galaxy Kinshasa'

    def handle(self, *args, **options):
        admin, _ = User.objects.get_or_create(
            email='admin@maisongalaxy.cd',
            defaults={
                'username': 'admin',
                'first_name': 'Admin', 'last_name': 'RH',
                'role': User.Role.ADMIN,
                'phone': '+243900000000',
                'is_staff': True, 'is_superuser': True,
            },
        )
        admin.set_password('admin123')
        admin.save()

        recruteur, _ = User.objects.get_or_create(
            email='rh@maisongalaxy.cd',
            defaults={
                'username': 'rh',
                'first_name': 'Sophie', 'last_name': 'Kabongo',
                'role': User.Role.RECRUTEUR,
                'phone': '+243900000099',
            },
        )
        recruteur.set_password('rh123456')
        recruteur.save()

        departments_data = [
            ('Direction', 'Direction générale Maison Galaxy'),
            ('Commercial', 'Équipe commerciale terrain Kinshasa'),
            ('Logistique', 'Gestion des stocks et approvisionnement'),
            ('RH', 'Ressources humaines'),
            ('IT', 'Technologies et systèmes d\'information'),
        ]
        departments = {}
        for name, desc in departments_data:
            dept, _ = Department.objects.get_or_create(name=name, defaults={'description': desc})
            departments[name] = dept

        deadline = (timezone.now() + timedelta(days=90)).date()
        jobs_data = [
            {
                'department': 'Commercial',
                'title': 'Commercial terrain Kinshasa',
                'description': 'Prospection et vente B2B sur le terrain à Kinshasa. Négociation commerciale et suivi client.',
                'required_skills': ['vente', 'prospection', 'négociation', 'crm'],
                'min_experience': 2,
                'required_degree': 'Licence commerce',
            },
            {
                'department': 'Logistique',
                'title': 'Assistant logistique',
                'description': 'Gestion des stocks, inventaires et coordination des livraisons.',
                'required_skills': ['logistique', 'stock', 'inventaire', 'supply chain'],
                'min_experience': 1,
                'required_degree': 'Graduat logistique',
            },
            {
                'department': 'IT',
                'title': 'Développeur web',
                'description': 'Développement d\'applications web internes. Python, Django, React.',
                'required_skills': ['python', 'django', 'react', 'javascript'],
                'min_experience': 2,
                'required_degree': 'Licence informatique',
            },
        ]

        jobs = {}
        for data in jobs_data:
            job, _ = JobOffer.objects.get_or_create(
                title=data['title'],
                defaults={
                    'department': departments[data['department']],
                    'description': data['description'],
                    'required_skills': data['required_skills'],
                    'min_experience': data['min_experience'],
                    'required_degree': data['required_degree'],
                    'location': 'Kinshasa',
                    'deadline': deadline,
                    'status': JobOffer.Status.ACTIVE,
                },
            )
            jobs[data['title']] = job

        commercial_job = jobs['Commercial terrain Kinshasa']
        for sample in SAMPLE_CVS:
            user, _ = User.objects.get_or_create(
                email=sample['email'],
                defaults={
                    'username': sample['email'].split('@')[0],
                    'first_name': sample['first_name'],
                    'last_name': sample['last_name'],
                    'phone': sample['phone'],
                    'role': User.Role.CANDIDAT,
                },
            )
            user.set_password('candidat123')
            user.save()

            if Application.objects.filter(candidate=user, job_offer=commercial_job).exists():
                continue

            score_result = score_application(commercial_job, sample['cv'])
            Application.objects.create(
                candidate=user,
                job_offer=commercial_job,
                cv_file='cvs/demo/placeholder.pdf',
                cv_text=sample['cv'],
                cover_letter=f"Je souhaite rejoindre {commercial_job.title}.",
                status=Application.Status.EN_ANALYSE,
                auto_score=score_result['final_score'],
                score_details=score_result,
                consent_given=True,
            )

        self.stdout.write(self.style.SUCCESS(
            'Données de démo chargées.\n'
            'Admin: admin@maisongalaxy.cd / admin123\n'
            'RH: rh@maisongalaxy.cd / rh123456\n'
            'Candidats: *@email.cd / candidat123'
        ))
