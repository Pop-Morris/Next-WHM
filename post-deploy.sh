#!/bin/bash

# Prevent interactive config
export DEBIAN_FRONTEND=noninteractive

# Clean up old deployment
echo "Cleaning up old deployment..."
rm -rf /var/www/html/whm-app/*

# Extract new deployment
echo "Extracting new deployment..."
tar -xzf deployment.tar.gz -C /var/www/html/whm-app

sudo apt-get update -y || exit 1

sudo apt-get install -y curl || exit 1

# install node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - || exit 1

sudo apt-get install -y nodejs || exit 1

#check app exists
mkdir -p /var/www/html/whm-app

# Naviagate to app directory
cd /var/www/html/whm-app || exit 1

node -v
npm -v

# Install dependencies
npm install || exit 1

# Build next.js app
npm run build || exit 1
