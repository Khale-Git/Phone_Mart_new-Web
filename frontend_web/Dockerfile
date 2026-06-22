# Stage 1: Build React app
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.26
COPY --from=build /app/dist /usr/share/nginx/html

# Create cache/run/log dirs and make them writable
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx \
    && chmod -R 777 /var/cache/nginx /var/run /var/log/nginx

# Change Nginx to listen on 8080 instead of 80
RUN sed -i 's/listen\s\+80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

EXPOSE 8080
