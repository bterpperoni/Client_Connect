#$ Build Stage
FROM node:18 AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

#? Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

#? Bundle app source code 
COPY . .

#? Build l'application
RUN  pnpm build

#$ Production Stage
FROM node:18-slim AS production

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]