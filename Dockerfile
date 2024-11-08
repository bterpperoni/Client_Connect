# Étape de build
FROM node:18-alpine AS builder
WORKDIR /app

# Installer pnpm globalement
RUN npm install -g pnpm

# Copier les fichiers du projet
COPY . .

# Définir la variable d'environnement pour Prisma
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Installer les dépendances et builder le projet
RUN pnpm install && pnpm run build

# Étape de production
FROM node:18-alpine
WORKDIR /app

# Installer pnpm globalement dans l'image de production
RUN npm install -g pnpm

# Copier les fichiers buildés depuis l'étape de build
COPY --from=builder /app ./

# Exposer le port de l'application et démarrer
EXPOSE 3000
CMD ["pnpm", "start"]

