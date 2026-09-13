# syntax=docker/dockerfile:1
FROM node:20-alpine

# Chromium for org chart PNG export (puppeteer-core)
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY ../../package-lock.json ./
COPY ../../package.json ./
COPY ../../packages/backend/package.json ./packages/backend/
COPY ../../packages/shared/package.json ./packages/shared/
COPY ../../packages/emails/package.json ./packages/emails/
COPY ../../packages/editor/package.json ./packages/editor/
COPY ../../packages/graph/package.json ./packages/graph/

ENV NODE_OPTIONS=--max-old-space-size=2048
ENV GENERATE_SOURCEMAP=false

# Next.js comes with @react-email/ui (email preview, dev only) and makes the layer too big for the Nhost registry
RUN --mount=type=cache,target=/root/.npm \
  npm ci \
  && rm -rf node_modules/next node_modules/@next node_modules/@react-email/ui

COPY ../.. .

EXPOSE 8888

WORKDIR /app/packages/backend
CMD ["npm", "start"]
