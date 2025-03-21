#!/bin/bash

# Naviagate to app directory
cd /var/www/html/whm-app

# Install dependencies
npm install

# Build next.js app
npm run build

# Start app in production
npm run start
