FROM node:20-bullseye-slim AS base

FROM base AS deps
WORKDIR /app

COPY sillage-store/package.json ./

# Install dependencies directly from package.json for compatibility with Railway builds.
RUN npm install --no-audit --no-fund --silent

FROM base AS builder
WORKDIR /app

# re-use installed node_modules to leverage layer caching
COPY --from=deps /app/node_modules ./node_modules
COPY sillage-store/package.json ./
COPY sillage-store/next.config.ts ./
COPY sillage-store/tsconfig.json ./
COPY sillage-store/eslint.config.mjs ./
COPY sillage-store/postcss.config.mjs ./
COPY sillage-store/components.json ./
COPY sillage-store/middleware.ts ./
COPY sillage-store/next-env.d.ts ./
COPY sillage-store/app ./app
COPY sillage-store/components ./components
COPY sillage-store/lib ./lib
COPY sillage-store/public ./public
COPY sillage-store/store ./store

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

# static assets
COPY --from=builder /app/public ./public

ENV NEXT_TELEMETRY_DISABLED=1

# If the Next build produced a `standalone` output, use it. Otherwise
# copy the full `.next` and `node_modules` so `next start` works.
RUN mkdir -p .next || true
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next server using the project `start` script (next start)
CMD ["npm", "run", "start"]