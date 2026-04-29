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

Variables bulk/worker si Redis est activé:

```dotenv
REDIS_URL=redis://localhost:6379
SMTP_THROTTLE_MAX_ITERATIONS=200
SMTP_THROTTLE_WINDOW_MINUTES=60
BULK_CSV_DIR=/app/bulk
```

En Docker dev, les conteneurs chargent `.env` puis `.env.dev`.
Les valeurs de `.env.dev` surchargent donc celles de `.env`.

### 3) Lancer en développement

```bash
make dev-up
```

Accès API GraphQL: [http://localhost:8025/graphql](http://localhost:8025/graphql)

La stack de developpement Docker lance:

- `morgans-dev`
- `morgans-worker`

Redis est traite comme un service tiers: `make dev-up` n'en lance pas.
Le bulk fonctionne seulement si `REDIS_URL` pointe vers un Redis joignable depuis les conteneurs.
En dev, le dossier local `bulk/` est monte directement dans `/app/bulk`.

Développement local sans Redis:

```bash
make dev
```

Sans Redis, l'API démarre en mode dégradé:
- `sendMail` et `sendMailWithTemplate` restent disponibles
- `createBulkJob` et `bulkJob` renvoient une erreur explicite tant que Redis n'est pas joignable

### 4) Lancer en production (compose prod)

Créer le réseau partagé si nécessaire:

```bash
docker network create interservices
```

Puis démarrer:

```bash
make morgans
```

La stack production lance:
- l'API GraphQL `morgans`
- le worker `morgans-worker` pour les jobs bulk

Les deux services partagent le volume `/app/bulk`.

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
    redisUrl
    redisAvailable
  }
}
```

`redisAvailable` permet de verifier si l'API arrive effectivement a joindre Redis au moment de l'appel.

### Bulk et Redis

Les opérations bulk dépendent de Redis et du worker ARQ:

- mutation `createBulkJob`
- query `bulkJob`
- query `bulkJobsInProgress`
- query `bulkJobs`

Si Redis n'est pas configuré ou indisponible, ces opérations échouent proprement, mais les envois unitaires continuent de fonctionner.
Le job est visible des l'enqueue avec le statut `queued`, avant passage en `running`.

Le fichier CSV doit deja etre present dans `BULK_CSV_DIR` (par defaut `/app/bulk`) et contenir:

- une colonne `email`
- une colonne par variable de template

Exemple de CSV:

```csv
email,firstName,coachName,invitationUrl
alice@example.com,Alice,Thomas Martin,https://app.fitdesk.io/invitations/public/token-a
bob@example.com,Bob,Sarah Leroy,https://app.fitdesk.io/invitations/public/token-b
```

### Mutation `createBulkJob`

```graphql
mutation CreateBulkJob($csvFile: String!, $template: String!, $subject: String!) {
  createBulkJob(csvFile: $csvFile, template: $template, subject: $subject) {
    jobId
  }
}
```

Variables:

```json
{
  "csvFile": "fitdesk/invitations-2026-04-29.csv",
  "template": "fitdeskinvitefromcoachtonoexistingathlete.fr.html",
  "subject": "{{ coachName }} t'invite a rejoindre FitDesk"
}
```

Le champ `subject` supporte aussi les variables Jinja2 du CSV ou du payload de template.
Exemple: `{{ coachName }} t'invite a rejoindre FitDesk`.

Pour un throttling plus flexible, tu peux definir:

- `SMTP_THROTTLE_MAX_ITERATIONS`
- `SMTP_THROTTLE_WINDOW_MINUTES`

Exemple:

```dotenv
SMTP_THROTTLE_MAX_ITERATIONS=15
SMTP_THROTTLE_WINDOW_MINUTES=1
```

Cela limite le worker a 15 envois sur une fenetre de 1 minute.
Les envois sont repartis de facon lisse sur la fenetre, avec un leger jitter pour eviter un pattern trop mecanique.

Ces deux variables constituent maintenant l'unique mecanisme de throttling du worker.
Exemple equivalent a l'ancien comportement "200 par heure":

```dotenv
SMTP_THROTTLE_MAX_ITERATIONS=200
SMTP_THROTTLE_WINDOW_MINUTES=60
```

### Query `bulkJob`

```graphql
query BulkJob($id: String!) {
  bulkJob(id: $id) {
    id
    status
    csvFile
    template
    subject
    total
    sent
    failed
    queuedAt
    startedAt
    completedAt
    errors {
      email
      error
    }
  }
}
```

### Query `bulkJobsInProgress`

```graphql
query BulkJobsInProgress($limit: Int!) {
  bulkJobsInProgress(limit: $limit) {
    id
    status
    csvFile
    template
    subject
    total
    sent
    failed
    queuedAt
    startedAt
    completedAt
  }
}
```

Variables:

```json
{
  "limit": 20
}
```

Cette query renvoie les jobs bulk actuellement en `queued` ou `running`.

### Query `bulkJobs`

```graphql
query BulkJobs($limit: Int!) {
  bulkJobs(limit: $limit) {
    id
    status
    csvFile
    template
    subject
    total
    sent
    failed
    queuedAt
    startedAt
    completedAt
  }
}
```

Variables:

```json
{
  "limit": 20
}
```

Cette query renvoie les jobs bulk recents, tous statuts confondus.

Variables:

```json
{
  "id": "replace-with-job-id"
}
```

Statuts observes:

- `running`
- `completed`
- `partial_failure`
- `failed`

---

## Templates e-mail

Sources React/TSX: `mail/templates/sources`

Templates compilés HTML: `mail/templates/compiled`

Référence technique des templates (catalogue + paramètres supportés):

- `docs/template-technical-reference.md`

Scénarios de test HTTP prêts à exécuter (GraphQL):

- `docs/http/`

Outil interactif pour tester l'envoi d'un template:

```bash
make test-template-send
```

Mode liste rapide:

```bash
python3 scripts/test-template-send.py --list-templates
```

Template mot de passe oublié disponible:

- `FitdeskForgotPassword` (inputs attendus dans les variables de rendu: `email`, `resetPasswordUrl`).
- Traductions externalisées en JSON:
  - `mail/templates/sources/FitdeskWelcomeAthlete.fr.json`
  - `mail/templates/sources/FitdeskWelcomeAthlete.en.json`
  - `mail/templates/sources/FitdeskWelcomeCoach.fr.json`
  - `mail/templates/sources/FitdeskWelcomeCoach.en.json`
  - `mail/templates/sources/FitdeskForgotPassword.fr.json`
  - `mail/templates/sources/FitdeskForgotPassword.en.json`

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


### Logs d'activité e-mail

Le service produit désormais des logs structurés pour chaque demande d'envoi:

- réception de la demande (`mail_request_received`, `mail_template_request_received`),
- démarrage envoi SMTP (`smtp_send_started`),
- résultat du traitement (`*_succeeded` / `*_failed`).

Chaque ligne inclut notamment:

- horodatage UTC,
- destinataire (`recipient`),
- début du sujet (`subject`, tronqué à 80 caractères),
- template (`template`),
- statut de traitement (`status`),
- détail technique (`detail`).
- alias legacy `*.classic.html` normalisé vers `*.en.html` (fallback par défaut quand le pays/locale est inconnu).

Variable d'environnement disponible:

```dotenv
LOG_LEVEL=INFO
```

## Commandes utiles

```bash
make help            # liste complète
make dev             # lancement local uvicorn avec .env.dev
make dev-up          # stack dev (docker compose)
make logs            # logs du conteneur
MORGANS_TEST_RECIPIENT=mailcatcher@example.test make test-send
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
