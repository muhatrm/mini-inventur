# Stage 1: Build Angular App
FROM node:20-alpine AS build
WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Source Code kopieren
COPY . .

# Angular Build ausführen
RUN npx nx build mini-inventar --configuration production

# Stage 2: Serve mit NGINX
FROM nginx:alpine

# Alte Default-Config entfernen und eigene laden
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Richtiger Build-Pfad mit "browser"
COPY --from=build /app/dist/mini-inventar/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

