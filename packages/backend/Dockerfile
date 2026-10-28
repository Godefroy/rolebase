# syntax=docker/dockerfile:1
FROM node:20-alpine

# Chromium for org chart PNG export (puppeteer-core)
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont tini
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY ../../package-lock.json ./
COPY ../../package.json ./
COPY ../../packages/backend/package.json ./packages/backend/
COPY ../../packages/shared/package.json ./packages/shared/
COPY ../../packages/emails/package.json ./packages/emails/
COPY ../../packages/editor/package.json ./packages/editor/
COPY ../../packages/graph/package.json ./packages/graph/

# Next.js comes with @react-email/ui (email preview, dev only) and makes the layer too big for the Nhost registry
RUN --mount=type=cache,target=/root/.npm \
  npm ci \
  && rm -rf node_modules/next node_modules/@next node_modules/@react-email/ui

COPY ../.. .

# Keep the heap well below the container memory limit (Chromium runs outside of it)
ENV NODE_OPTIONS=--max-old-space-size=384

EXPOSE 8888

WORKDIR /app/packages/backend
# Run node directly (npm and the tsx CLI would each add a process),
# under tini to reap Chromium's orphan processes and forward signals
CMD ["/sbin/tini", "--", "node", "--import", "tsx", "src/index.ts"]
