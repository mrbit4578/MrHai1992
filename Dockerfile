FROM node:20-bookworm-slim
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

COPY . .
# Build (or keep prebuilt dist) + install Render start shims
ENV RENDER=true
RUN npm run build && node scripts/render-shims.cjs

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=10000
EXPOSE 10000

# Prefer npm start (works if Docker Command left default/empty or set to npm start)
CMD ["node", "server.cjs"]
