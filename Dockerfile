FROM node:18-alpine AS builder
WORKDIR /app

# Installer pnpm globalement
RUN npm install -g pnpm

# Copier les fichiers du projet
COPY . .

# Définir la variable d'environnement pour Prisma
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

# Étape de production
FROM node:18-alpine AS production
WORKDIR /app

# Installer pnpm globalement dans l'image de production
RUN npm install -g pnpm

# Copier les fichiers buildés depuis l'étape de build
COPY --from=builder /app ./

# Exposer le port de l'application et démarrer
EXPOSE 3000
CMD [ "sh", "-c", "source .env && pnpm run build && pnpm start" ]