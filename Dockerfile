FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
COPY package.json ./
COPY scripts/static-server.mjs ./scripts/static-server.mjs
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "scripts/static-server.mjs"]
