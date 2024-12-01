#. Build Stage
FROM node:18 AS builder

WORKDIR /app

#? Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

#? Bundle app source code 
COPY . .

#? Build l'application
RUN  pnpm build --no-lint

#. Production Stage
FROM node:18-slim AS production

WORKDIR /app

# RUN apt-get update -y && apt-get install -y openssl

# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/public ./public

EXPOSE 3000

# CMD ["node", "server.js"]
CMD ["pnpm","start"]
