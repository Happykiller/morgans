# Makefile
.DEFAULT_GOAL := help

.PHONY: help install \
        dev dev-up dev-up-build dev-shell \
        build docker-build tar load-prod-image run-prod \
        morgans morgans-build morgans-clean logs down shell \
        render-template test-send status

## 🆘 AIDE & INSTALLATION

help:
	@echo ""
	@echo "📌 Makefile — commandes disponibles :"
	@echo ""
	@echo "🔧 install             Installer les dépendances Python avec Poetry"
	@echo "🚀 dev                 Lancer FastAPI en local (host direct)"
	@echo ""
	@echo "🧪 dev-up              Lancer le conteneur morgans-dev (volume + hot reload)"
	@echo "🔁 dev-up-build        Rebuild + up du conteneur morgans-dev"
	@echo "💻 dev-shell           Shell dans le conteneur dev"
	@echo ""
	@echo "🐳 morgans             Démarrer le conteneur prod morgans"
	@echo "🐳 morgans-build       Build + up de l'image morgans"
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
	@echo "                       Utilisation : make render-template name=Welcome"
	@echo "✉️  test-send          Envoie un e-mail de test en appelant GraphQL"
	@echo "🔎 status              Affiche l’état des conteneurs, réseaux, images"
	@echo ""

install:
	poetry install

## 🚀 DÉVELOPPEMENT LOCAL

dev:
	poetry run uvicorn main:app --reload --port 8000

dev-up:
	docker compose up morgans-dev

dev-up-build:
	docker rm -f morgans-dev || true
	docker compose up --build morgans-dev

dev-shell:
	docker compose exec morgans-dev /bin/bash

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
	docker compose -f docker-compose.prod.yml up -d

run-prod:
	docker run --rm -it -p 8000:8000 --env-file .env morgans

## 🐳 CONTENEUR PRODUCTION

morgans:
	docker compose up -d

morgans-build:
	docker compose up --build -d

morgans-clean:
	docker rmi morgans || true

logs:
	docker logs morgans -f

down:
	docker compose down

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


## 🧪 TEST & OUTILS

render-template:
	@if [ -z "$(name)" ]; then \
		echo "❌ Please provide a template name, e.g. 'make render-template name=Welcome'"; \
		exit 1; \
	fi
	@echo "🛠️  Rendering template: $(name).tsx → $(name).html"
	docker compose exec morgans-dev bash -c "cd mail/templates && npx tsx render.ts $(name)"

test-send:
	./scripts/test-send.sh
