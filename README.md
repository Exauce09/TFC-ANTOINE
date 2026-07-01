# SIGER — Système Intelligent de Gestion de Recrutement

Application web complète pour **Maison Galaxy Kinshasa** : tri automatique hybride des candidatures (règles + NLP) et notifications e-mail/SMS.

**Statut : site complet — prêt pour l'hébergement.** Voir [Guide d'hébergement](docs/hebergement.md).

## Fonctionnalités

### Portail candidat
- Inscription / connexion
- Consultation et filtrage des offres
- Dépôt de candidature (CV PDF/DOCX)
- Suivi du statut en temps réel
- Gestion du profil

### Dashboard RH
- Candidatures triées par score intelligent
- Shortlist, refus, convocation entretien
- Ajustement manuel du score
- Export CSV
- Gestion complète des offres (créer, modifier, clôturer)
- Rapports et statistiques
- Historique des notifications e-mail/SMS

### Administration
- Gestion des départements (admin)
- Admin Django pour configuration avancée

## Démarrage local

```bash
# Backend
cd backend
py -m venv venv
.\venv\Scripts\pip install -r requirements.txt
$env:USE_SQLITE="true"
$env:DEBUG="true"
.\venv\Scripts\python manage.py migrate
.\venv\Scripts\python manage.py seed_demo
.\venv\Scripts\python manage.py runserver 127.0.0.1:8001

# Frontend (autre terminal)
cd frontend
npm install
npm run dev
```

**Site :** http://127.0.0.1:5180

## Comptes de démo

| Rôle | E-mail | Mot de passe |
|------|--------|--------------|
| Admin | admin@maisongalaxy.cd | admin123 |
| RH | rh@maisongalaxy.cd | rh123456 |
| Candidat | jean.mutombo@email.cd | candidat123 |

## Hébergement production

```bash
cp .env.example .env
# Configurer .env (voir docs/hebergement.md)
docker compose -f docker-compose.prod.yml up --build -d
```

## Documentation

- [Cahier des charges](docs/cahier-des-charges.md)
- [Architecture](docs/architecture.md)
- [Manuel utilisateur](docs/manuel-utilisateur.md)
- [Guide d'hébergement](docs/hebergement.md)

## Tests

```bash
cd backend
.\venv\Scripts\python manage.py test apps.scoring.tests apps.applications.tests apps.notifications.tests
```

## GitHub

https://github.com/Exauce09/TFC-ANTOINE
