FROM node:20-bookworm-slim
WORKDIR /app

COPY package.json package-lock.json ./
# Install all deps (vite is in dependencies). Skip lifecycle first, then build once.
RUN npm install --ignore-scripts

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=10000
EXPOSE 10000

CMD ["node", "server.cjs"]
