# Guide d'hébergement — SIGER Maison Galaxy

Le site est **complet et prêt à déployer**. Il ne reste que la mise en ligne sur un serveur.

## Prérequis serveur

- VPS Linux (Ubuntu 22.04+ recommandé) — 2 Go RAM minimum
- Docker + Docker Compose installés
- Nom de domaine (ex. `recrutement.maisongalaxy.cd`)
- Certificat SSL (Let's Encrypt via Certbot)

## Déploiement en 5 étapes

### 1. Cloner le projet

```bash
git clone https://github.com/Exauce09/TFC-ANTOINE.git
cd TFC-ANTOINE
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
nano .env
```

Variables obligatoires en production :

```env
DEBUG=False
DJANGO_SECRET_KEY=<générer-une-clé-50-caractères>
ALLOWED_HOSTS=votre-domaine.cd,backend
POSTGRES_PASSWORD=<mot-de-passe-fort>

EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=<clé-sendgrid>
DEFAULT_FROM_EMAIL=recrutement@maisongalaxy.cd

AFRICASTALKING_USERNAME=<votre-username>
AFRICASTALKING_API_KEY=<votre-clé>
AFRICASTALKING_SENDER=MaisonGalaxy
```

### 3. Lancer en production

```bash
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

Le site est accessible sur le port **80**.

### 4. HTTPS avec Certbot (recommandé)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d recrutement.maisongalaxy.cd
```

### 5. Sauvegardes

```bash
# Sauvegarde base de données (cron quotidien)
docker compose -f docker-compose.prod.yml exec db pg_dump -U siger siger > backup.sql
```

## Architecture production

```
Internet → Nginx (port 80/443)
              ├── /        → Frontend React (fichiers statiques)
              ├── /api/    → Django backend
              ├── /admin/  → Django admin
              └── /media/  → Fichiers CV
```

Services Docker : `nginx`, `backend`, `celery`, `db` (PostgreSQL), `redis`

## Premier compte admin

Après le déploiement, créez le compte administrateur :

```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

Puis connectez-vous et configurez départements, offres et comptes RH via l'interface.

## Fonctionnalités incluses

- Portail candidat (inscription, offres, candidature, suivi)
- Dashboard RH (tri par score, shortlist, refus, convocation)
- Gestion des offres d'emploi (CRUD)
- Rapports et statistiques
- Historique des notifications e-mail/SMS
- Gestion des départements (admin)
- Profil utilisateur
- Tri intelligent hybride (règles + NLP)
- Politique de confidentialité

## Support

Documentation complète : [README.md](../README.md)
