FROM php:8.2-apache

# Enable mysqli
RUN docker-php-ext-install mysqli

# Copy your app to container
COPY . /var/www/html/

# Expose port 8080
EXPOSE 8080

# Start Apache
CMD ["apache2-foreground"]
ENV PORT 8080
RUN sed -i "s/80/${PORT}/g" /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf
