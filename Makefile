# Makefile
.DEFAULT_GOAL := help

COMPOSE_DEV := docker compose
COMPOSE_PROD := docker compose -f docker-compose.prod.yml

.PHONY: help install \
        dev dev-up dev-up-build dev-shell \
        build docker-build tar load-prod-image run-prod \
        morgans morgans-build morgans-clean logs down shell \
        render-template test-send test-template-send status version

## 🆘 AIDE & INSTALLATION

help:
	@echo ""
	@echo "📌 Makefile — commandes disponibles :"
	@echo ""
	@echo "🔧 install             Installer les dépendances Python avec Poetry"
	@echo "🚀 dev                 Lancer FastAPI en local avec .env.dev"
	@echo ""
	@echo "🧪 dev-up              Lancer la stack dev (API + worker)"
	@echo "🔁 dev-up-build        Rebuild + up de la stack dev (API + worker)"
	@echo "💻 dev-shell           Shell dans le conteneur dev"
	@echo ""
	@echo "🐳 morgans             Démarrer la stack prod (docker-compose.prod.yml)"
	@echo "🐳 morgans-build       Rebuild l'image locale puis redémarrer la stack prod"
	@echo "🧹 morgans-clean       Supprimer l'image locale"
	@echo "📜 logs                Logs du conteneur"
	@echo "🛑 down                Stopper tous les conteneurs"
	@echo "🖥️  shell              Shell dans le conteneur prod"
	@echo ""
	@echo "📦 docker-build        Build de l'image (Dockerfile)"
	@echo "📦 tar                 Sauvegarder l'image en .tar"
	@echo "📥 load-prod-image     Charger l'image tar + up en prod"
	@echo "🏃 run-prod            Lancer localement l’image en standalone"
	@echo ""
	@echo "🎨 render-template     Render un template email .tsx → .html"
	@echo "                        Utilisation : make render-template name=Welcome"
	@echo "✉️  test-send          Envoie un e-mail de test en appelant GraphQL"
	@echo "🧭 test-template-send Outil interactif pour tester un template email"
	@echo "🔎 status              Affiche l’état des conteneurs, réseaux, images"
	@echo "🔍 version             Affiche la version de l’application via GraphQL"
	@echo ""

install:
	poetry install

## 🚀 DÉVELOPPEMENT LOCAL

dev:
	set -a; . ./.env.dev; set +a; poetry run uvicorn main:app --reload --port 8000

dev-up:
	$(COMPOSE_DEV) up morgans-dev morgans-worker

dev-up-build:
	docker rm -f morgans-dev || true
	docker rm -f morgans-worker || true
	$(COMPOSE_DEV) up --build morgans-dev morgans-worker

dev-shell:
	$(COMPOSE_DEV) exec morgans-dev /bin/bash

## 🐳 BUILD / PROD

build:
	docker build -t morgans -f Dockerfile .

docker-build:
	docker build -t morgans -f Dockerfile .

tar:
	make docker-build
	docker save morgans -o morgans.tar

load-prod-image:
	docker stop morgans || true
	docker rm morgans || true
	docker image rm morgans || true
	docker load -i morgans.tar
	docker network inspect interservices >/dev/null 2>&1 || docker network create interservices
	$(COMPOSE_PROD) up -d

run-prod:
	docker run --rm -it -p 8000:8000 --env-file .env morgans

## 🐳 CONTENEUR PRODUCTION

morgans:
	$(COMPOSE_PROD) up -d

morgans-build:
	docker build -t morgans -f Dockerfile .
	$(COMPOSE_PROD) up -d

morgans-clean:
	docker rmi morgans || true

logs:
	docker logs morgans -f

down:
	$(COMPOSE_DEV) down

shell:
	docker compose exec morgans /bin/bash

status:
	@echo "📦 Conteneurs actifs :"
	@docker ps --filter name=morgans --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

	@echo ""
	@echo "🔗 Réseaux Docker liés :"
	@docker network inspect interservices --format '{{range .Containers}}{{.Name}}{{"\t"}}{{.IPv4Address}}{{"\n"}}{{end}}' || echo "❌ Réseau 'interservices' non trouvé"

	@echo ""
	@echo "🧊 Images locales Morgans :"
	@docker images morgans --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

version:
	bash ./scripts/version.sh

## 🧪 TEST & OUTILS

render-template:
	@if [ -z "$(name)" ]; then \
		echo "❌ Please provide a template name, e.g. 'make render-template name=Welcome'"; \
		exit 1; \
	fi
	@echo "🛠️  Rendering template: $(name).tsx → $(name).html"
	docker compose exec morgans-dev bash -c "cd mail/templates && npx tsx render.ts $(name)"

test-send:
	bash ./scripts/test-send.sh

test-template-send:
	python3 ./scripts/test-template-send.py
