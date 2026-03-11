# ── Стадия 1: сборка ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# Генерируем Prisma Client и собираем Nuxt
RUN npx prisma generate && pnpm build

# ── Стадия 2: минимальный runtime образ ──────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Берём только нужное из builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env* ./

ENV NODE_ENV=production

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node_modules/.bin/prisma db seed && node .output/server/index.mjs"]
