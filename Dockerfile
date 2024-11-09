# Étape 2: Build de l'application
FROM node:18-alpine AS builder

RUN mkdir /app

WORKDIR /app

ARG NODE_ENV=production
ARG DATABASE_URL
ARG NEXtAUTH_URL
ARG NEXTAUTH_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET

ENV DATABASE_URL=${DATABASE_URL}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV NODE_ENV=${NODE_ENV}

RUN npm install -g pnpm
COPY . .
RUN pnpm install && pnpm run build

# Étape 3: Production (l'image finale)
FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm
COPY --from=builder /app ./



EXPOSE 3000

CMD ["pnpm", "start"]

