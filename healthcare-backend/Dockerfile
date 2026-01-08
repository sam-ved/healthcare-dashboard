FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies separately for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Build
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src
RUN npm run prisma:generate && npm run build

# Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/dist ./dist
COPY package.json ./package.json
COPY --from=base /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
CMD ["node", "dist/index.js"]
