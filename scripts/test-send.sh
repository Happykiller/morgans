#!/usr/bin/env bash

set -e

ENDPOINT="${MORGANS_ENDPOINT:-http://localhost:8025/graphql}"
TEST_RECIPIENT="${MORGANS_TEST_RECIPIENT:-}"
TEST_SUBJECT="${MORGANS_TEST_SUBJECT:-Bienvenue sur Vergo}"
TEST_IDENTITY="${MORGANS_TEST_IDENTITY:-Test User}"
TEST_EMAIL="${MORGANS_TEST_EMAIL:-$TEST_RECIPIENT}"
TEST_PASSWORD="${MORGANS_TEST_PASSWORD:-super-secret}"
TEST_LOGO_URL="${MORGANS_TEST_LOGO_URL:-https://vergo.happykiller.net/favicon-192x192.png}"
TEST_SERVICE_URL="${MORGANS_TEST_SERVICE_URL:-https://vergo.happykiller.net/}"
TEST_SERVICE_NAME="${MORGANS_TEST_SERVICE_NAME:-Vergo}"
TEST_SIGURI_URL="${MORGANS_TEST_SIGURI_URL:-https://siguri.happykiller.net/}"

if [ -z "$TEST_RECIPIENT" ]; then
  echo "MORGANS_TEST_RECIPIENT is required." >&2
  echo "Example: MORGANS_TEST_RECIPIENT=mailcatcher@example.test make test-send" >&2
  exit 1
fi

echo "📤 Sending test email to ${TEST_RECIPIENT} via ${ENDPOINT}..."

curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "query": "mutation sendMailWithTemplate(\$input: MailTemplateInput!) { sendMailWithTemplate(input: \$input) { success message } }",
  "variables": {
    "input": {
      "to": "${TEST_RECIPIENT}",
      "subject": "${TEST_SUBJECT}",
      "template": "welcome.html",
      "variables": {
        "id": "${TEST_IDENTITY}",
        "email": "${TEST_EMAIL}",
        "password": "${TEST_PASSWORD}",
        "logoUrl": "${TEST_LOGO_URL}",
        "serviceUrl": "${TEST_SERVICE_URL}",
        "serviceName": "${TEST_SERVICE_NAME}",
        "siguriUrl": "${TEST_SIGURI_URL}"
      }
    }
  }
}
EOF

echo ""
