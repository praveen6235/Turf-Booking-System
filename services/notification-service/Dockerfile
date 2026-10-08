# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/common ./packages/common
COPY services/notification-service ./services/notification-service

RUN npm ci --workspace=packages/common --workspace=services/notification-service --omit=dev

# Stage 2: Production Minimal Image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

USER node

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/packages/common ./packages/common
COPY --chown=node:node --from=builder /app/services/notification-service ./services/notification-service

WORKDIR /app/services/notification-service

EXPOSE 5006
CMD ["node", "src/server.js"]
