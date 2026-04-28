FROM node:20-bullseye-slim AS base

FROM base AS deps
WORKDIR /app

# copy lockfile if present for deterministic installs
COPY package*.json package-lock*.json ./

# Install dependencies (prefer npm ci if lockfile exists)
RUN if [ -f package-lock.json ]; then \
			npm ci --no-audit --no-fund --silent; \
		else \
			npm install --no-audit --no-fund --silent; \
		fi

FROM base AS builder
WORKDIR /app

# re-use installed node_modules to leverage layer caching
COPY --from=deps /app/node_modules ./node_modules
COPY . .

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