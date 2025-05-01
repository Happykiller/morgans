.DEFAULT_GOAL := help

.PHONY: help install dev up down logs shell test docker-build docker-run docker-clean tar install-image dev-docker

help:
	@echo ""
	@echo "📌 Available Makefile commands:"
	@echo ""
	@echo "🔧 install         Install Python dependencies using Poetry"
	@echo "🚀 dev             Run the FastAPI app locally with auto-reload"
	@echo "🐳 up              Build and start Docker containers in background"
	@echo "🛑 down            Stop and remove running Docker containers"
	@echo "📜 logs            Tail logs from all Docker containers"
	@echo "🖥️ shell           Open an interactive shell inside the 'morgans' container"
	@echo "📦 tar             Build the Docker image and save it as a .tar file"
	@echo "📥 install-image   Load the .tar Docker image and run it in prod mode"
	@echo "🐋 docker-run      Run the container locally with .env environment"
	@echo "🧹 docker-clean    Remove the local 'morgans' Docker image"
	@echo "🧪 dev-docker      Start the dev container with mounted volume and hot reload"
	@echo ""

# Dépendances Python
install:
	poetry install

dev:
	poetry run uvicorn main:app --reload --port 8000

# Docker
up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

shell:
	docker compose exec morgans /bin/bash

# Build the Docker image and save it as a tarball
tar: 
	docker build -t morgans -f Dockerfile .
	docker save morgans -o morgans.tar

# Install the Docker image by loading it from a tarball and running it
install-image:
	docker stop morgans || true
	docker rm morgans || true
	docker image rm morgans || true
	docker load -i morgans.tar
	docker compose -f docker-compose.prod.yml up -d

docker-run:
	docker run --rm -it -p 8000:8000 --env-file .env morgans

docker-clean:
	docker rmi morgans || true

dev-docker:
	docker rm -f morgans-dev
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
	