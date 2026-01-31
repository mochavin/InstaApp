#!/bin/bash

# Deployment script for InstaApp
# This script is executed on the VM after the build files are copied

set -e

APP_DIR="/var/www/instaapp"

cd $APP_DIR

echo "📥 Pulling latest changes from GitHub..."
git pull origin main

echo "📦 Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

echo "🗑️ Clearing caches..."
php artisan optimize:clear

echo "⚡ Optimizing application..."
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🔄 Restarting queue workers (if any)..."
php artisan queue:restart 2>/dev/null || true

echo "✅ Deployment completed successfully!"
