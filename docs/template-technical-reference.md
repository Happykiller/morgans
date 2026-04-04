# Template Technical Reference

This document lists all compiled email templates available in Morgans and the Jinja variables each template supports.

## How templates are resolved

- API mutation: `sendMailWithTemplate(input: MailTemplateInput!)`
- Input field used by backend: `input.template`
- Actual lookup happens in `mail/smtp.py` with `resolve_template_name()`
- Legacy alias support: any template containing `.classic.` is normalized to `.en.`

Example:
- request template: `fitdeskplanupgrade.fr.html`
- locale variant: `fitdeskplanupgrade.en.html`

## Template catalog

| Template | Description | Variables |
|---|---|---|
| `welcome.html` | Generic Vergo welcome email | `id`, `email`, `password`, `logoUrl`, `serviceUrl`, `serviceName`, `siguriUrl` |
| `test.html` | Internal visual test template | none |
| `fitdeskwelcomecoach.fr.html` / `fitdeskwelcomecoach.en.html` | FitDesk coach onboarding welcome | `firstName` |
| `fitdeskwelcomeathlete.fr.html` / `fitdeskwelcomeathlete.en.html` | FitDesk athlete onboarding welcome | `firstName` |
| `fitdeskforgotpassword.fr.html` / `fitdeskforgotpassword.en.html` | FitDesk password reset email | `email`, `resetPasswordUrl` |
| `fitdeskplanupgrade.fr.html` / `fitdeskplanupgrade.en.html` | FitDesk plan upgrade and trial-to-paid scenarios | `firstName`, `previousPlan`, `newPlan`, `previousClientLimit`, `newClientLimit`, `ctaUrl` |
| `fitdeskplandowngrade.fr.html` / `fitdeskplandowngrade.en.html` | FitDesk plan downgrade scenarios | `firstName`, `previousPlan`, `newPlan`, `previousClientLimit`, `newClientLimit`, `ctaUrl` |

## Variable definitions

### `welcome.html`

| Variable | Required | Description |
|---|---|---|
| `id` | yes | User identifier displayed in greeting and credentials block |
| `email` | yes | User email address shown in the email |
| `password` | yes | Initial password shown in welcome message |
| `logoUrl` | yes | URL used for the service logo image |
| `serviceUrl` | yes | Main URL of the platform (links and CTA) |
| `serviceName` | yes | Service display name shown in copy |
| `siguriUrl` | yes | URL used for secure storage helper CTA |

### `fitdeskwelcomecoach.*.html` and `fitdeskwelcomeathlete.*.html`

| Variable | Required | Description |
|---|---|---|
| `firstName` | yes | First name inserted in heading |

### `fitdeskforgotpassword.*.html`

| Variable | Required | Description |
|---|---|---|
| `email` | yes | Account email shown in details block |
| `resetPasswordUrl` | yes | Password reset URL used in CTA and fallback text |

### `fitdeskplanupgrade.*.html`

| Variable | Required | Description |
|---|---|---|
| `firstName` | yes | First name in title |
| `previousPlan` | yes | Previous plan label (displayed uppercased) |
| `newPlan` | yes | New plan label (displayed uppercased) |
| `previousClientLimit` | yes | Previous allowed client count |
| `newClientLimit` | yes | New allowed client count (for premium, pass `∞` explicitly if desired) |
| `ctaUrl` | yes | Destination URL for the CTA |

### `fitdeskplandowngrade.*.html`

| Variable | Required | Description |
|---|---|---|
| `firstName` | yes | First name in title |
| `previousPlan` | yes | Previous plan label (displayed uppercased) |
| `newPlan` | yes | New plan label (displayed uppercased) |
| `previousClientLimit` | yes | Previous allowed client count |
| `newClientLimit` | yes | New allowed client count |
| `ctaUrl` | yes | Destination URL for the CTA |

## FitDesk plan-change scenario mapping

Use `fitdeskplanupgrade.*.html` for:
- `trial -> starter`
- `trial -> pro`
- `trial -> premium`
- `starter -> pro`
- `starter -> premium`
- `pro -> premium`

Use `fitdeskplandowngrade.*.html` for:
- `pro -> starter`
- any future downgrade flow with reduced client limit

## Test samples

Concrete GraphQL examples are available in `docs/req.http` for all plan-change scenarios.
