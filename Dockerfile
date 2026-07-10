# Optional Docker path for Web Service — pure Node start, no shell binaries.
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=10000
COPY --from=build /app/dist ./dist
COPY server.mjs ./server.mjs
EXPOSE 10000
# Exec form: does not depend on /bin/sh
CMD ["node", "server.mjs"]
