# Étape de build
FROM node:18-alpine AS builder
WORKDIR /app

# Installer pnpm globalement
RUN npm install -g pnpm

# Copier les fichiers du projet et installer les dépendances avec pnpm
COPY . .
RUN pnpm install && pnpm run build

# Étape de production
FROM node:18-alpine
WORKDIR /app

# Installer pnpm globalement dans l'image de production aussi
RUN npm install -g pnpm

# Copier les fichiers buildés depuis l'étape de build
COPY --from=builder /app ./

# Exposer le port de l'application et démarrer
EXPOSE 3000
CMD ["pnpm", "start"]
