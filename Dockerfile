# Build Stage
FROM node:18 AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY . .

# Build l'application
RUN pnpm build

# Production Stage
FROM node:18 AS base

WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000

CMD ["pnpm", "start"]