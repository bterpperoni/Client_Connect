# Build Stage
FROM node:18

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

# Bundle app source code 
COPY . .

# Build l'application
RUN  pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]