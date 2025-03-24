#!/bin/bash

#check app exists
mkdir -p /var/www/html/whm-app

# Naviagate to app directory
cd /var/www/html/whm-app || exit 1

#check for pm2 (process manager)
if ! command -V pm2 &> /dev/null
then
  echo "pm2 not found, installing..."
  npm install -g pm2 || exit 1
else
  echo "pm2 is already installed"
fi

# Install dependencies
npm install || exit 1

# Build next.js app
npm run build || exit 1

# Start app in production
pm2 start /var/www/html/whm-app/dist/app.js --name "whm-app" || exit 1
