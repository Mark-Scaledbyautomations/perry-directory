# Perry Business Directory — static SPA in a container.
# Stage 1 builds dist/ with node; stage 2 serves it with Caddy (same pattern
# as aipodpal-web on the staging droplet: caddy:2-alpine serving /srv).
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM caddy:2-alpine
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
