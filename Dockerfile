# Étape 1: Installer Docker et Docker Compose (si vraiment nécessaire)
FROM debian:bullseye-slim AS docker-installer

# Installer les dépendances nécessaires pour Docker et Docker Compose
RUN apt-get update && \
    apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    sudo \
    python3-pip \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Ajouter la clé Docker pour la signature des paquets
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/docker-archive-keyring.gpg

# Ajouter le dépôt Docker à la liste des sources APT
RUN echo "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list

# Installer Docker et Docker Compose
RUN apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io

# Installer Docker Compose
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Vérifier l'installation de Docker et Docker Compose
RUN which docker
RUN docker-compose --version

# Étape 2: Build de l'application
FROM node:18-alpine AS builder
WORKDIR /app

# Installer pnpm globalement
RUN npm install -g pnpm

# Copier les fichiers du projet
COPY . .

# Définir la variable d'environnement pour Prisma et autres
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET

ENV DATABASE_URL=${DATABASE_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

# Installer les dépendances et builder le projet
RUN pnpm install && pnpm run build

# Étape 3: Production (l'image finale)
FROM node:18-alpine

# Copier Docker et Docker Compose de l'étape précédente
COPY --from=docker-installer /usr/local/bin/docker-compose /usr/local/bin/docker-compose
COPY --from=docker-installer /usr/bin/docker /usr/bin/docker

WORKDIR /app

# Installer pnpm globalement dans l'image de production
RUN npm install -g pnpm

# Copier les fichiers buildés depuis l'étape de build
COPY --from=builder /app ./

# Copier le script d'entrée
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Exposer le port de l'application
EXPOSE 3000

# Lancer l'application et docker-compose
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
