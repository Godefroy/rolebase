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
COPY ../../packages/editor-legacy/package.json ./packages/editor-legacy/
COPY ../../packages/graph/package.json ./packages/graph/

ENV NODE_OPTIONS=--max-old-space-size=2048
ENV GENERATE_SOURCEMAP=false

RUN npm install

COPY ../.. .

EXPOSE 8888

WORKDIR /app/packages/backend
CMD ["npm", "start"]
