# Morgans

**Morgans** is a simple and extensible **GraphQL** service for sending emails via SMTP.

## Features

- GraphQL mutation `sendMail` to send emails (plain text or HTML).
- Secure reading of SMTP configuration from `.env` file.
- Deployment in development and production environments via **Docker Compose**.
- Detailed SMTP logging to ease debugging.

## Tech Stack

- **FastAPI** for the web API.
- **Strawberry GraphQL** for defining the GraphQL schema.
- **aiosmtplib** for asynchronous email sending.
- **Pydantic Settings** for environment-based configuration.
- **Poetry** for dependency management.
- **Docker** and **Docker Compose** for deployment.

## Quick Start

### 1. Clone the repository

```bash
git clone <repo-url>
cd morgans
```

### 2. Set up your environment

Create a `.env` file at the root:

```dotenv
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASSWORD=your_password
MAIL_FROM=you@example.com
```

### 3. Run in development mode

```bash
docker-compose up morgans-dev
```

Access GraphQL API: [http://localhost:8000/graphql](http://localhost:8000/graphql)

_(with automatic reload thanks to Uvicorn)_

### 4. Run in production mode

Make sure the Docker network `interservices` exists:

```bash
docker network create interservices
```

Then launch:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Access GraphQL API: [http://<your-server>:8080/graphql](http://<your-server>:8080/graphql)

## API Usage

### Mutation `sendMail`

#### Example Query

```graphql
mutation SendMail($input: MailInput!) {
  sendMail(input: $input) {
    success
    message
  }
}
```

#### Variables

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

## Project Structure

```
.
├── mail/
│   └── smtp.py          # SMTP sending logic
├── schema/
│   ├── queries.py       # Ping query
│   ├── mutations.py     # sendMail mutation
│   └── types.py         # GraphQL types definition
├── main.py              # FastAPI and GraphQL initialization
├── config.py            # Secure SMTP config loading
├── Dockerfile           # Docker image build
├── docker-compose.yml   # Development environment
├── docker-compose.prod.yml # Production environment
├── pyproject.toml       # Poetry dependencies
└── README.md            # Documentation
```

## Security Notes

- **Do not expose** this service directly to the Internet without additional protection.
- It is intended to be used **only within internal Docker networks**.

---

> Project initialized by **Fabrice**.

