# Schéma entité-relation — SIGER

## Diagramme ER

```mermaid
erDiagram
    USER ||--o{ APPLICATION : submits
    USER ||--o{ AUDIT_LOG : performs
    DEPARTMENT ||--o{ JOB_OFFER : contains
    JOB_OFFER ||--o{ APPLICATION : receives
    APPLICATION ||--o{ NOTIFICATION_LOG : triggers

    USER {
        int id PK
        string email UK
        string phone
        string role
        string first_name
        string last_name
        string password_hash
        datetime created_at
    }

    DEPARTMENT {
        int id PK
        string name UK
        text description
        datetime created_at
    }

    JOB_OFFER {
        int id PK
        int department_id FK
        string title
        text description
        json required_skills
        int min_experience
        string required_degree
        string location
        date deadline
        string status
        datetime created_at
        datetime updated_at
    }

    APPLICATION {
        int id PK
        int candidate_id FK
        int job_offer_id FK
        string cv_file
        text cover_letter
        text cv_text
        string status
        float auto_score
        float final_score
        json score_details
        boolean consent_given
        datetime created_at
        datetime updated_at
    }

    SCORING_CRITERIA {
        int id PK
        int job_offer_id FK
        float skills_weight
        float experience_weight
        float degree_weight
        float keywords_weight
        float nlp_weight
        float rules_weight
    }

    NOTIFICATION_LOG {
        int id PK
        int application_id FK
        string channel
        string recipient
        string template_name
        string status
        text error_message
        datetime sent_at
        datetime created_at
    }

    AUDIT_LOG {
        int id PK
        int application_id FK
        int user_id FK
        string action
        json details
        datetime created_at
    }
```

## Tables PostgreSQL

### accounts_user
Extension du modèle User Django avec champs `phone`, `role` (candidat, recruteur, admin).

### jobs_department
Départements Maison Galaxy.

### jobs_joboffer
Offres d'emploi avec compétences en JSON.

### applications_application
Candidatures avec scores et détails JSON.

### scoring_scoringcriteria
Poids configurables par offre (défaut : skills 40 %, experience 25 %, degree 15 %, keywords 20 % ; rules 60 % / nlp 40 %).

### notifications_notificationlog
Historique des envois e-mail et SMS.

### applications_auditlog
Traçabilité des actions RH.

## Index recommandés

- `applications_application(job_offer_id, auto_score DESC)`
- `applications_application(candidate_id, status)`
- `jobs_joboffer(status, deadline)`
- `notifications_notificationlog(application_id, created_at)`
