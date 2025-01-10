# BigCommerce Webhook Manager 🔔

A modern, user-friendly application built with Next.js that simplifies webhook management for your BigCommerce store.

## Features ✨

- **Webhook Management**
  - Create new webhooks
  - Update existing webhooks
  - Delete webhooks
  - Fetch and view all webhooks
- **Secure Authentication** 
  - User registration
  - Login/logout functionality
  - Password reset capabilities
- **Modern Tech Stack**
  - Built with Next.js 15+
  - TypeScript support
  - Prisma ORM
  - Secure API routes

## Prerequisites 📋

Before you begin, ensure you have:
- Node.js 18.0 or later
- npm or yarn package manager
- A BigCommerce store with API credentials
- PostgreSQL database

## Installation 🚀

1. Clone the repository:
 ```bash
git clone https://github.com/Pop-Morris/Next-WHM.git
cd bigcommerce-webhook-manager
```
2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```
BIGCOMMERCE_STORE_HASH="your-store-hash"
BIGCOMMERCE_ACCESS_TOKEN="your-access-token"
```

## Usage 💡

1. Register for an account or login with existing credentials
2. Navigate to the dashboard to view your webhooks
3. Use the intuitive interface to:
   - Create new webhooks by specifying destination URLs and events
   - Modify existing webhook configurations
   - Remove unwanted webhooks
   - View webhook delivery status and history

## API Routes 🛣️

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/webhooks` | GET | Fetch all webhooks |
| `/api/webhooks` | POST | Create a new webhook |
| `/api/webhooks/:id` | PUT | Update a webhook |
| `/api/webhooks/:id` | DELETE | Delete a webhook |

## Security 🔒

- JWT-based authentication
- Password hashing with bcrypt
- CSRF protection
- Rate limiting
- Input validation

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments 🙏

- Built with [Next.js](https://nextjs.org/)
- Powered by [BigCommerce API](https://developer.bigcommerce.com/)
- Database managed with [Prisma](https://www.prisma.io/)


---

Made with ❤️ for the BigCommerce community

