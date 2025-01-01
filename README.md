# 🔔 BigCommerce Webhook Manager

A modern web application built with Next.js that simplifies the management of BigCommerce webhooks. Create, monitor, and manage your webhooks with an intuitive interface.

## ✨ Features

- 🔐 **Secure User Authentication**
  - User registration and login
  - Password reset functionality with email verification
  - Personalized webhook profiles per user

- 🎯 **Webhook Management**
  - Create and configure new webhooks
  - Monitor webhook status and history
  - Update existing webhook configurations
  - Delete unused webhooks

- 💾 **Data Persistence**
  - PostgreSQL database integration
  - Secure credential storage
  - User-specific webhook profiles

## 🛠️ Tech Stack

- **Frontend**
  - [Next.js 14](https://nextjs.org/) - React framework
  - [Tailwind CSS](https://tailwindcss.com/) - Styling
  - React Server Components
  - Server Actions

- **Backend**
  - [PostgreSQL](https://www.postgresql.org/) - Database
  - [Prisma](https://www.prisma.io/) - ORM
  - [NextAuth.js](https://next-auth.js.org/) - Authentication

- **Deployment**
  - [Coolify](https://coolify.io/) - Self-hosted deployment platform

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pop-Morris/Next-WHM.git
   cd bigcommerce-webhook-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```


<p align="center">
  Made with ❤️ by Mason and Josh
</p>
