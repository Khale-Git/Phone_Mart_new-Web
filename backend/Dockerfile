FROM php:8.2-apache

# Enable mysqli
RUN docker-php-ext-install mysqli

# Copy PHP app from backend_php into Apache docroot
COPY backend_php/ /var/www/html/

# Fix permissions so Apache can serve files
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Ensure index.php is used as the DirectoryIndex and allow .htaccess
RUN echo 'DirectoryIndex index.php' >> /etc/apache2/apache2.conf \
    && echo '<Directory /var/www/html/>\n    Options Indexes FollowSymLinks\n    AllowOverride All\n    Require all granted\n</Directory>' >> /etc/apache2/apache2.conf

# Enable rewrite module
RUN a2enmod rewrite || true

# Expose on non-privileged port so OpenShift non-root UID can bind
ENV PORT=8080
RUN sed -i "s/80/${PORT}/g" /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf || true

EXPOSE 8080

CMD ["apache2-foreground"]
