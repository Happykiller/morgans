#!/usr/bin/env bash

set -e

echo "📤 Sending test email to fabrice.rosito@gmail.com..."

curl -s -X POST http://localhost:8025/graphql \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "query": "mutation sendMailWithTemplate(\$input: MailTemplateInput!) { sendMailWithTemplate(input: \$input) { success message } }",
  "variables": {
    "input": {
      "to": "fabrice.rosito@gmail.com",
      "subject": "Bienvenue sur Vergo 🎉",
      "template": "welcome.html",
      "variables": {
        "id": "Fabrice",
        "email": "fabrice.rosito@gmail.com",
        "password": "super-secret",
        "logoUrl": "https://vergo.happykiller.net/assets/apple-touch-icon-180x180.png",
        "serviceUrl": "https://vergo.happykiller.net/",
        "serviceName": "Vergo",
        "siguriUrl": "https://siguri.happykiller.net/"
      }
    }
  }
}
EOF

echo ""
