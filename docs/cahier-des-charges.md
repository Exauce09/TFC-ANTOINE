# Cahier des charges — SIGER Maison Galaxy Kinshasa

## 1. Présentation du projet

**SIGER** (Système Intelligent de Gestion de Recrutement) est une solution web destinée à **Maison Galaxy Kinshasa** pour automatiser le tri des candidatures et notifier les candidats par e-mail et SMS.

## 2. Contexte

Maison Galaxy Kinshasa reçoit un volume croissant de candidatures pour ses différents départements (Commercial, Logistique, Direction, RH, IT). Le traitement manuel est chronophage et source d'erreurs. Le SIGER centralise le processus et accélère la présélection grâce à un moteur hybride (règles métier + NLP).

## 3. Objectifs

| Objectif | Indicateur |
|----------|------------|
| Centraliser les offres et candidatures | 100 % des postes gérés via la plateforme |
| Automatiser le tri | Score 0–100 en < 30 s après dépôt |
| Notifier les candidats | Accusé e-mail + SMS à la réception |
| Aider la décision RH | Classement, filtres, validation humaine |

## 4. Périmètre fonctionnel

### 4.1 Portail candidat
- Consultation des offres actives
- Création de compte et authentification
- Dépôt de candidature (CV PDF/DOCX, lettre de motivation)
- Suivi du statut de candidature

### 4.2 Dashboard RH
- Gestion des offres d'emploi (CRUD)
- Consultation des candidatures triées par score
- Validation / ajustement des scores
- Changement de statut (shortlist, refus, convocation)
- Export CSV

### 4.3 Moteur de tri intelligent
- Extraction texte des CV
- Scoring par règles (compétences, expérience, diplôme, mots-clés)
- Scoring NLP (similarité sémantique TF-IDF)
- Agrégation et recommandation (shortlist / analyse / refus suggéré)

### 4.4 Notifications
- E-mail : accusé réception, shortlist, refus, convocation
- SMS : messages courts pour les mêmes événements clés
- Journalisation des envois

## 5. Acteurs

| Acteur | Rôle |
|--------|------|
| Candidat | Consulte offres, postule, suit son dossier |
| Recruteur RH | Consulte candidatures, valide tri, notifie |
| Admin RH | Gère offres, utilisateurs, paramètres |

## 6. Contraintes techniques

- Application web responsive (mobile-friendly)
- Backend Python Django + API REST
- Frontend React
- Base PostgreSQL
- Déploiement Docker Compose
- Numéros téléphone format +243 (RDC)

## 7. Contraintes non fonctionnelles

- Sécurité : HTTPS, mots de passe hashés, accès CV restreint RH
- Performance : tri < 30 s, interface réactive
- Traçabilité : logs notifications et actions RH
- Consentement candidat pour traitement des données

## 8. Livrables

- Application web fonctionnelle
- Documentation technique et utilisateur
- Jeu de données de démonstration Maison Galaxy
- Diagrammes UML et schéma ER
