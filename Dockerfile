# One image for the API, the web app and one-off jobs (migrations, demo data).
#   docker compose --profile app up --build
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/db/package.json packages/db/
COPY packages/domain/package.json packages/domain/
COPY packages/i18n/package.json packages/i18n/
RUN npm ci --no-audit --no-fund
COPY apps/api apps/api
COPY apps/web apps/web
COPY packages packages
COPY spec spec
COPY .env.example ./
# The web app's /api rewrite is fixed at build time; inside compose the API is reachable as "api".
ARG API_URL=http://api:4100
ENV API_URL=$API_URL NEXT_TELEMETRY_DISABLED=1
RUN npx turbo run build --filter=@varchasv/web --filter=@varchasv/api

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=node:node /app /app
USER node
EXPOSE 4100 3100
CMD ["node", "apps/api/dist/server.js"]
