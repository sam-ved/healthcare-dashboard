# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (better cache)
COPY package*.json ./
RUN npm ci || npm install

# Copy source and build
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine AS runtime

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
