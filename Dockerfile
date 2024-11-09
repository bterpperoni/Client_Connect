# Étape 1: Installer Docker et Docker Compose (si vraiment nécessaire)
FROM debian:bullseye-slim AS docker-installer

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

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/docker-archive-keyring.gpg
RUN echo "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io

RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Étape 2: Build de l'application
FROM node:18-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm
COPY . .
RUN pnpm install && pnpm run build

# Étape 3: Production (l'image finale)
FROM node:18-alpine

COPY --from=docker-installer /usr/local/bin/docker-compose /usr/local/bin/docker-compose
COPY --from=docker-installer /usr/bin/docker /usr/bin/docker

WORKDIR /app

RUN npm install -g pnpm
COPY --from=builder /app ./

# Copier et vérifier le script d’entrée
COPY ./src/app/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
RUN ls -l /usr/local/bin/entrypoint.sh  # Vérification des droits d’exécution

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["pnpm", "start"]
