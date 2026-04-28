FROM oven/bun:1 AS base

FROM base AS deps

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build


FROM base AS production

WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public

ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir .next
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["bun", "start"]