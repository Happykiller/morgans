.DEFAULT_GOAL := help

.PHONY: help install dev up down logs shell test docker-build docker-run docker-clean tar load-prod-image dev-docker dev-shell render-template

help:
	@echo ""
	@echo "📌 Available Makefile commands:"
	@echo ""
	@echo "🔧 install           Install Python dependencies using Poetry"
	@echo "🚀 dev               Run the FastAPI app locally with auto-reload"
	@echo "🐳 up                Build and start Docker containers in background"
	@echo "🛑 down              Stop and remove running Docker containers"
	@echo "📜 logs              Tail logs from all Docker containers"
	@echo "🖥️  shell             Open an interactive shell inside the 'morgans' container"
	@echo "📦 docker-build      Build the Docker image from Dockerfile"
	@echo "📦 tar               Build the Docker image and save it as a .tar file"
	@echo "📥 load-prod-image   Load the .tar Docker image and run it in prod mode"
	@echo "🐋 run-prod          Run the container locally with .env environment"
	@echo "🧹 docker-clean      Remove the local 'morgans' Docker image"
	@echo "🔁 dev-docker        Start the dev container with mounted volume and hot reload"
	@echo "💻 dev-shell         Open an interactive shell in the dev container"
	@echo "🧩 render-template   Render a mail template via TSX (name=...)"
	@echo ""

# Dépendances Python
install:
	poetry install

dev:
	poetry run uvicorn main:app --reload --port 8000

# Docker
docker-build:
	docker build -t morgans -f Dockerfile .

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

shell:
	docker compose exec morgans /bin/bash

tar:
	make docker-build
	docker save morgans -o morgans.tar

load-prod-image:
	docker stop morgans || true
	docker rm morgans || true
	docker image rm morgans || true
	docker load -i morgans.tar
	docker compose -f docker-compose.prod.yml up -d

run-prod:
	docker run --rm -it -p 8000:8000 --env-file .env morgans

docker-clean:
	docker rmi morgans || true

dev-docker:
	docker rm -f morgans-dev || true
	docker compose up --build morgans-dev

dev-shell:
	docker compose exec morgans-dev /bin/bash

render-template:
	@if [ -z "$(name)" ]; then \
		echo "❌ Please provide a template name, e.g. 'make render-template name=Welcome'"; \
		exit 1; \
	fi
	@echo "🛠️  Rendering template: $(name).tsx → $(name).html"
	docker compose exec morgans-dev bash -c "cd mail/templates && npx tsx render.ts $(name)"
