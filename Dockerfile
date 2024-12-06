#. Build Stage
FROM node:22 AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN  pnpm build

# RUN apt-get update -y && apt-get install -y openssl

# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/public ./public

EXPOSE 3000

# CMD ["node", "server.js"]
CMD ["pnpm","start"]
