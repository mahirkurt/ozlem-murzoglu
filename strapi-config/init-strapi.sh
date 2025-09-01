#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Check if Strapi project exists
if [ ! -f "package.json" ]; then
  echo "Creating new Strapi project..."
  npx create-strapi-app@latest . \
    --dbclient=postgres \
    --dbhost=postgres \
    --dbport=5432 \
    --dbname=strapi \
    --dbusername=strapi \
    --dbpassword=strapi_password \
    --dbssl=false \
    --no-run
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build admin panel
echo "Building admin panel..."
npm run build

# Start Strapi
echo "Starting Strapi..."
npm run develop