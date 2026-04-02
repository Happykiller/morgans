# Morgans

Morgans est un microservice **FastAPI + GraphQL** dédié à l'envoi d'e-mails via SMTP.
Le projet est léger, orienté service interne, et fournit deux cas d'usage:

- envoi d'e-mail texte/HTML,
- envoi d'e-mail à partir de templates HTML compilés.

---

## Revue technique du projet

### Positionnement architecture

L'architecture actuelle est simple et pragmatique:

- **Entrée API**: `main.py` expose l'endpoint GraphQL `/graphql`.
- **Couche présentation GraphQL**: `schema/queries.py`, `schema/mutations.py`, `schema/types.py`.
- **Couche infrastructure**: `mail/smtp.py` (SMTP + rendu Jinja2), `config.py` (chargement des variables d'environnement).

> Remarque: le projet n'est pas encore structuré en hexagonal stricte (pas de couche `core/usecases` distincte), mais la séparation API / infrastructure est déjà en place et peut évoluer proprement.

### Capacités fonctionnelles actuellement disponibles

- **Query `ping`** pour health-check rapide.
- **Query `system`** pour exposer la configuration SMTP active (hors mot de passe), ainsi que la version lue depuis `VERSION`.
- **Mutation `sendMail`** pour l'envoi standard.
- **Mutation `sendMailWithTemplate`** pour l'envoi basé sur template compilé + variables JSON.
- **Responsabilité i18n côté client**: le client choisit directement le fichier template localisé (ex: `welcome.fr.html`).

### Qualité actuelle (synthèse)

- **Points forts**
  - Stack moderne et concise (FastAPI, Strawberry, aiosmtplib, Pydantic Settings).
  - Configuration externalisée via `.env` / `.env.dev`.
  - Outils dev/prod clairs via `Makefile` et Docker Compose.
  - Pipeline de rendu de templates mail déjà opérationnel.

- **Points d'attention**
  - Gestion d'erreurs orientée message brut (`str(e)`) côté mutations (à normaliser).
  - Peu de garde-fous de validation métier (format d'e-mail, contraintes sur variables templates).
  - Pas de suite de tests automatisés visible (unitaires/intégration).
  - Exposition potentielle de données de configuration via `system` à restreindre selon l'environnement.

---

## Stack technique

- **Python 3.11**
- **FastAPI**
- **Strawberry GraphQL**
- **aiosmtplib**
- **Pydantic Settings**
- **Jinja2**
- **Poetry**
- **Docker / Docker Compose**

---

## Démarrage rapide

### 1) Cloner le dépôt

```bash
git clone <repo-url>
cd morgans
```

### 2) Configurer l'environnement

Créer un fichier `.env.dev` (développement) ou `.env` (production):

```dotenv
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASSWORD=your_password
SMTP_TLS=false
MAIL_FROM=you@example.com
```

### 3) Lancer en développement

```bash
make dev-up
```

Accès API GraphQL: [http://localhost:8025/graphql](http://localhost:8025/graphql)

### 4) Lancer en production (compose prod)

Créer le réseau partagé si nécessaire:

```bash
docker network create interservices
```

Puis démarrer:

```bash
make morgans
```

---

## API GraphQL

### Mutation `sendMail`

```graphql
mutation SendMail($input: MailInput!) {
  sendMail(input: $input) {
    success
    message
  }
}
```

Variables:

```json
{
  "input": {
    "to": "recipient@example.com",
    "subject": "Hello",
    "body": "This is a test email",
    "html": false
  }
}
```

### Mutation `sendMailWithTemplate`

```graphql
mutation SendMailWithTemplate($input: MailTemplateInput!) {
  sendMailWithTemplate(input: $input) {
    success
    message
  }
}
```

Variables:

```json
{
  "input": {
    "to": "recipient@example.com",
    "subject": "Welcome",
    "template": "welcome.fr.html",
    "variables": {
      "firstName": "Alex"
    }
  }
}
```

### Query `system`

```graphql
query {
  system {
    smtpHost
    smtpPort
    smtpUser
    mailFrom
    smtpTls
    version
  }
}
```

---

## Templates e-mail

Sources React/TSX: `mail/templates/sources`

Templates compilés HTML: `mail/templates/compiled`

Compilation manuelle d'un template:

```bash
cd mail/templates
npx tsx render.ts Welcome
```

Ou via Makefile (conteneur dev):

```bash
make render-template name=Welcome
```

---

## Commandes utiles

```bash
make help            # liste complète
make dev             # lancement local uvicorn avec .env.dev
make dev-up          # stack dev (docker compose)
make logs            # logs du conteneur
make test-send       # test d'envoi via mutation GraphQL
make version         # version exposée par l'API
```

---

## Structure du projet

```text
.
├── main.py
├── config.py
├── schema/
│   ├── queries.py
│   ├── mutations.py
│   └── types.py
├── mail/
│   ├── smtp.py
│   └── templates/
│       ├── sources/
│       └── compiled/
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
├── Makefile
└── README.md
```

---

## Sécurité et exploitation

- Ne pas exposer ce service directement sur Internet sans authentification, ACL réseau et rate-limiting.
- Restreindre l'accès à l'endpoint GraphQL aux services de confiance.
- Éviter de versionner des variables sensibles dans les fichiers d'environnement.

---

## Roadmap recommandée

1. Introduire une structure hexagonale explicite (`core/usecases`, `adapters`).
2. Ajouter des tests automatisés (unitaires + intégration SMTP mock).
3. Standardiser les erreurs API (codes fonctionnels + messages stables).
4. Ajouter observabilité (logs structurés, corrélation, métriques).
5. Ajouter garde-fous de sécurité (authN/authZ, quotas, validation renforcée).
