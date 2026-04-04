# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**Morgans** is a lightweight Python microservice for transactional email delivery. It exposes a GraphQL API (Strawberry + FastAPI) that accepts email send requests and delivers them via SMTP (aiosmtplib). Templates are authored as React TSX components (`@react-email`), pre-compiled to static HTML, then rendered at runtime with Jinja2 for variable substitution.

## Commands

### Local development (no Docker)
```bash
make install       # Install Python deps via Poetry
make dev           # Start FastAPI with hot-reload on port 8000
```

### Docker-based development
```bash
make dev-up        # Start dev container (port 8025, volume mounts, hot-reload)
make dev-up-build  # Rebuild and start
make dev-shell     # Open shell inside running container
make logs          # Follow container logs
make down          # Stop containers
```

### Email templates
Templates are TSX source files in `mail/templates/sources/` that must be compiled before use:
```bash
make render-template name=Welcome          # Compiles Welcome.tsx → compiled/welcome.en.html
make render-template name=FitdeskWelcomeAthlete  # etc.
# Internally runs: cd mail/templates && npx tsx render.ts <Name>
```

Template docs and test requests:
- `docs/template-technical-reference.md` — template catalog and supported variables
- `docs/req.http` — ready-to-run GraphQL request samples

### Testing
There are no automated tests. Manual validation:
```bash
make test-send     # Sends a test email via GraphQL mutation to verify SMTP + template flow
```

### Production
```bash
make morgans        # Start prod stack (docker-compose.prod.yml)
make morgans-build  # Rebuild and start
make version        # Query running service version via GraphQL
```

## Architecture

### Request flow
```
GraphQL mutation (schema/mutations.py)
  → mail/smtp.py: resolve_template_name() + send_email_with_template()
    → Jinja2 renders compiled HTML with caller-provided variables
      → aiosmtplib delivers via SMTP
```

### Key files
- `main.py` — FastAPI app, mounts Strawberry GraphQL router
- `config.py` — Pydantic Settings; reads `SMTP_HOST`, `SMTP_PORT`, `MAIL_FROM`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_TLS`, `LOG_LEVEL`
- `schema/types.py` — Strawberry input/output types (`MailInput`, `MailTemplateInput`, `MailResponse`)
- `schema/mutations.py` — `sendMail` and `sendMailWithTemplate` mutations
- `schema/queries.py` — `ping` health check, `system` config query
- `mail/smtp.py` — SMTP client, template resolution, Jinja2 rendering, structured logging
- `logging_utils.py` — `SafeExtraAdapter` that guarantees consistent structured log fields (defaults to `"-"`)

### Template pipeline
1. **Source:** `mail/templates/sources/<Name>.tsx` — React components using `@react-email`
2. **Compile:** `npx tsx render.ts <Name>` → `mail/templates/compiled/<name>.<locale>.html`
3. **Runtime:** Jinja2 loads compiled HTML and substitutes `{{ variable }}` placeholders

Localization is caller-driven: the client specifies the template name including locale (e.g., `fitdesk-welcome-athlete.fr`). The `.classic.` alias is normalized to `.en.` as a fallback (`normalize_template_name()` in `smtp.py`).

### Logging
All email activity is logged as structured events with consistent fields: `event`, `recipient`, `subject`, `template`, `status`, `detail`. Events emitted: `mail_request_received`, `smtp_send_started`, `smtp_send_succeeded/failed`, `mail_processing_succeeded/failed`, `template_alias_normalized`.

### Environment
Multiple `.env` files are supported: `.env` (base), `.env.dev` (dev overrides), `.env.prod` (prod). The Docker setup passes these through. Required config: `SMTP_HOST`, `SMTP_PORT`, `MAIL_FROM`.

### Docker
The `Dockerfile` is multi-stage and installs both Python 3.11 (Poetry) and Node.js 20 (for template rendering). Production uses `docker-compose.prod.yml` which attaches to an external Docker network named `interservices`.
