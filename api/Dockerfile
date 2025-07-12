FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libicu-dev libzip-dev libpq-dev \
    && docker-php-ext-install intl pdo pdo_mysql zip opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# Set environment for Composer
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV APP_ENV=prod

RUN composer install --no-dev --optimize-autoloader

# Permissions (optional)
RUN chown -R www-data:www-data var

CMD ["php-fpm"]
