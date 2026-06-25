# Guide de déploiement — SIGER Maison Galaxy

## Prérequis

- Docker et Docker Compose
- Domaine avec certificat SSL (production)
- Compte SendGrid/Brevo (e-mail production)
- Compte Africa's Talking (SMS RDC)

## Déploiement Docker

```bash
cp .env.example .env
# Éditer .env : DEBUG=False, clés SMTP et SMS
docker compose up --build -d
```

Services démarrés :
- `backend` : API Django sur port 8000
- `frontend` : React sur port 5173
- `db` : PostgreSQL 16
- `redis` : Broker Celery
- `celery` : Worker notifications

## Variables production essentielles

```env
DEBUG=False
DJANGO_SECRET_KEY=<clé-aléatoire-50-caractères>
ALLOWED_HOSTS=votre-domaine.cd,backend
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=<clé-sendgrid>
AFRICASTALKING_USERNAME=<username>
AFRICASTALKING_API_KEY=<clé-api>
```

## Reverse proxy Nginx (exemple)

```nginx
server {
    listen 443 ssl;
    server_name recrutement.maisongalaxy.cd;

    location /api/ {
        proxy_pass http://localhost:8000;
    }
    location /admin/ {
        proxy_pass http://localhost:8000;
    }
    location / {
        proxy_pass http://localhost:5173;
    }
}
```

## Sauvegardes

```bash
docker compose exec db pg_dump -U siger siger > backup_$(date +%Y%m%d).sql
```

## Résultats tests (prototype)

| Test | Résultat |
|------|----------|
| Scoring CV fort aligné | Score ≥ 60, recommandation shortlist/manual_review |
| Scoring CV non aligné | Score < 40, refus suggéré |
| Auth register/login | JWT fonctionnel |
| Notifications e-mail | Envoi console/SMTP validé |
| Notifications SMS | Mode dev (console) / API Africa's Talking |
| Export CSV | Endpoint RH fonctionnel |
| Build frontend | Production build OK |

## Perspectives

- OCR pour CV scannés (Tesseract)
- WhatsApp Business API
- Modèle ML supervisé sur historique recrutements
