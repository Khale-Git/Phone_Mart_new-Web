# Stage 1: Build React app
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.26
COPY --from=build /app/dist /usr/share/nginx/html

# Create cache/run/log dirs and make them writable for OpenShift non-root runtimes
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx \
    && chmod -R 777 /var/cache/nginx /var/run /var/log/nginx
