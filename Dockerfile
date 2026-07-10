# Optional: Docker Web Service — only needs committed dist/ + server.cjs
FROM node:20-alpine
WORKDIR /app
COPY server.cjs ./
COPY dist ./dist
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=10000
EXPOSE 10000
CMD ["node", "server.cjs"]
