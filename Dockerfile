# Étape 2: Build de l'application
FROM node:18-alpine AS builder

RUN mkdir /app

WORKDIR /app

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

