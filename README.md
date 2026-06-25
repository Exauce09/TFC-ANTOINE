# SIGER — Système Intelligent de Gestion de Recrutement

Application web pour **Maison Galaxy Kinshasa** : tri automatique hybride des candidatures (règles + NLP) et notifications e-mail/SMS.

## Architecture

- **Backend** : Python 3.12, Django 5, Django REST Framework, Celery, Redis
- **Frontend** : React 18, Vite, Tailwind CSS
- **Base de données** : PostgreSQL 16
- **Tri intelligent** : scikit-learn (TF-IDF + similarité cosinus) + règles métier

## Démarrage rapide (Docker)

```bash
cp .env.example .env
docker compose up --build
```

- Frontend : http://localhost:5173
- API : http://localhost:8000/api/
- Admin Django : http://localhost:8000/admin/

### Comptes de démo (après seed)

| Rôle | E-mail | Mot de passe |
|------|--------|--------------|
| Admin RH | admin@maisongalaxy.cd | admin123 |
| Recruteur | rh@maisongalaxy.cd | rh123456 |
| Candidat | jean.mutombo@email.cd | candidat123 |

## Démarrage local (sans Docker)

### Backend

```bash
cd backend
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# PostgreSQL et Redis doivent être démarrés
py manage.py migrate
py manage.py seed_demo
py manage.py runserver
```

### Celery (terminal séparé)

```bash
celery -A config worker -l info
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API principale

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register/` | Inscription candidat |
| `POST /api/auth/login/` | Connexion JWT |
| `GET /api/jobs/` | Liste des offres |
| `POST /api/applications/` | Dépôt candidature (multipart) |
| `PATCH /api/applications/{id}/status/` | Changement statut (RH) |
| `GET /api/applications/export-csv/` | Export CSV (RH) |
| `GET /api/notifications/` | Logs notifications (RH) |

## Documentation

- [Cahier des charges](docs/cahier-des-charges.md)
- [Architecture UML](docs/architecture.md)
- [Schéma ER](docs/schema-er.md)
- [Manuel utilisateur](docs/manuel-utilisateur.md)

## Tests

```bash
cd backend
py manage.py test
```

## Déploiement production

1. Configurer `.env` avec `DEBUG=False`, clés SMTP et Africa's Talking
2. `docker compose -f docker-compose.yml up -d`
3. Configurer un reverse proxy HTTPS (Nginx/Caddy)
4. Sauvegardes PostgreSQL planifiées

## Licence

Projet académique — Maison Galaxy Kinshasa © 2026
