#!/usr/bin/env bash
# Serverda: ./deploy.sh — menyuni zaxiralaydi, GitHub'dagi oxirgi kodni oladi va qayta ishga tushiradi.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "❌ .env fayli yo'q. Avval: cp .env.example .env && nano .env"
  exit 1
fi

mkdir -p backups
if docker compose ps --status running app 2>/dev/null | grep -q app; then
  backup="backups/menu-$(date +%F-%H%M%S).json"
  if docker compose exec -T app cat /app/data/menu.json > "$backup" 2>/dev/null; then
    echo "✓ Menyu zaxiralandi: $backup"
  else
    rm -f "$backup"
  fi
  # keep the 30 newest backups
  ls -1t backups/menu-*.json 2>/dev/null | tail -n +31 | xargs -r rm -f || true
fi

git pull --ff-only
docker compose up -d --build --remove-orphans
docker image prune -f >/dev/null
echo "✓ Tayyor. Holat: docker compose ps   |   Loglar: docker compose logs -f app"
