from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from apps.accounts.models import User, CandidateProfile
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
                'image_key': 'commercial',
            },
            {
                'department': 'Logistique',
                'title': 'Assistant logistique',
                'description': 'Gestion des stocks, inventaires et coordination des livraisons.',
                'required_skills': ['logistique', 'stock', 'inventaire', 'supply chain'],
                'min_experience': 1,
                'required_degree': 'Graduat logistique',
                'image_key': 'logistique',
            },
            {
                'department': 'IT',
                'title': 'Développeur web',
                'description': 'Développement d\'applications web internes. Python, Django, React.',
                'required_skills': ['python', 'django', 'react', 'javascript'],
                'min_experience': 2,
                'required_degree': 'Licence informatique',
                'image_key': 'it',
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
                    'image_key': data.get('image_key', ''),
                },
            )
            if job.image_key != data.get('image_key', ''):
                job.image_key = data.get('image_key', '')
                job.save(update_fields=['image_key'])
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

            profile, _ = CandidateProfile.objects.get_or_create(user=user)
            profile_data = {
                'jean.mutombo@email.cd': {
                    'diplome': 'Licence commerce', 'field_of_study': 'Commerce et marketing',
                    'years_experience': 5, 'current_position': 'Commercial terrain',
                    'skills': ['vente', 'prospection', 'négociation', 'crm'],
                    'bio': 'Commercial expérimenté sur le terrain à Kinshasa.',
                },
                'marie.kabila@email.cd': {
                    'diplome': 'Graduat infirmier', 'field_of_study': 'Soins infirmiers',
                    'years_experience': 1, 'current_position': 'Infirmière',
                    'skills': ['soins', 'patients', 'urgences'],
                    'bio': 'Infirmière débutante motivée.',
                },
                'paul.lumumba@email.cd': {
                    'diplome': 'Graduat commerce', 'field_of_study': 'Commerce',
                    'years_experience': 2, 'current_position': 'Assistant commercial',
                    'skills': ['vente', 'détail', 'relation client'],
                    'bio': 'Assistant commercial en vente au détail.',
                },
                'grace.mukendi@email.cd': {
                    'diplome': 'Bac+3 logistique', 'field_of_study': 'Logistique et supply chain',
                    'years_experience': 4, 'current_position': 'Logisticienne',
                    'skills': ['logistique', 'stock', 'inventaire', 'supply chain'],
                    'bio': 'Spécialiste logistique avec 4 ans d\'expérience.',
                },
                'david.tshisekedi@email.cd': {
                    'diplome': 'Licence informatique', 'field_of_study': 'Développement web',
                    'years_experience': 3, 'current_position': 'Développeur web',
                    'skills': ['python', 'django', 'react', 'javascript'],
                    'bio': 'Développeur full-stack passionné.',
                },
            }
            pdata = profile_data.get(sample['email'], {})
            if pdata:
                for k, v in pdata.items():
                    setattr(profile, k, v)
                profile.save()

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
