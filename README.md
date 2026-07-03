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
.\venv\Scripts\python manage.py createsuperuser
.\venv\Scripts\python manage.py runserver 127.0.0.1:8001

# Frontend (autre terminal)
cd frontend
npm install
npm run dev
```

**Admin Django** : http://127.0.0.1:8001/admin/

- Identifiant : **adresse e-mail** (pas le nom d'utilisateur)
- Mot de passe : celui défini avec `createsuperuser`
- Seuls les comptes avec `is_staff` peuvent se connecter (un compte candidat créé via l'inscription publique n'y a pas accès)

Avec `createsuperuser`, le **premier champ demandé est l'e-mail** (ex. `admin@maisongalaxy.cd`), puis le nom d'utilisateur, prénom et nom.

**Site :** http://127.0.0.1:5180

La base démarre vide. Créez un compte admin avec `createsuperuser`, puis configurez départements et offres via l'interface RH.

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
