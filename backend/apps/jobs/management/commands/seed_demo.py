from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Désactivé — ne charge plus de données de démonstration'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING(
            'seed_demo est désactivé. La base doit rester vide (données réelles uniquement).\n'
            'Créez un compte admin avec : python manage.py createsuperuser'
        ))
