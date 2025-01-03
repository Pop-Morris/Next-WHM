import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      $allOperations({ operation, model, args, query }) {
        console.log(`Running ${model}.${operation}`);
        return query(args);
      },
    },
  });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
// Test database connection
prisma.$connect()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
