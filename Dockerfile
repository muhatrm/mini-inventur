# Stage 1: Build Angular App
FROM node:20-alpine AS build
WORKDIR /app

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S angular -u 1001

# Dependencies installieren
COPY --chown=angular:nodejs package*.json ./
RUN npm ci --legacy-peer-deps --only=production && \
    npm cache clean --force

# Source Code kopieren
COPY --chown=angular:nodejs . .

# Angular Build mit optimierungen
RUN npx nx build mini-inventar --configuration production \
    --silence-deprecation=import \
    --output-hashing=all

# Stage 2: Production Nginx
FROM nginx:alpine

# Security updates
RUN apk update && \
    apk upgrade && \
    apk add --no-cache tzdata && \
    rm -rf /var/cache/apk/*

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/* && \
    rm -rf /usr/share/nginx/html/*

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist/mini-inventar/browser /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Use non-root user
USER nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
