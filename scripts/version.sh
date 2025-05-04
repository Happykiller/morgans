#!/usr/bin/env bash

set -e

echo "🔍 Getting Morgans version..."

curl -s -X POST http://localhost:8025/graphql \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "query": "{ 
    system { 
      version 
      smtpHost
      smtpPort
      smtpUser
      mailFrom
      smtpTls 
    } 
  }"
}
EOF

echo ""
