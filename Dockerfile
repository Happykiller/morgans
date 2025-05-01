# Dockerfile
# 🐍 Image de base Python
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Prérequis système pour node et email rendering
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Installer Node.js (v20 LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Installer poetry
RUN pip install poetry

# Copier les fichiers de dépendances
COPY pyproject.toml poetry.lock* ./

# Configurer poetry pour désactiver les virtualenvs
RUN poetry config virtualenvs.create false && \
    poetry install --no-root --no-interaction --no-ansi

# Copier les fichiers du projet
COPY . .

# Préinstaller les dépendances des templates React
RUN cd mail/templates && npm install

# Définir la commande de démarrage (FastAPI via Uvicorn)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
