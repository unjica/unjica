import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Create a new Prisma client with logging in development
const createPrismaClient = () => {
  try {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    // Add middleware for error logging
    client.$use(async (params, next) => {
      try {
        return await next(params);
      } catch (error) {
        console.error(`Prisma Error in ${params.model}.${params.action}:`, error);
        throw error;
      }
    });

    // Test the connection
    client.$connect()
      .then(() => {
        console.log('Database connection established successfully');
      })
      .catch((error) => {
        console.error('Failed to connect to the database:', error);
      });

    return client;
  } catch (error) {
    console.error('Error creating Prisma client:', error);
    
    // Return a mock client that will throw clear errors
    return new Proxy({} as PrismaClient, {
      get: (target, prop) => {
        if (prop === '$connect' || prop === '$disconnect') {
          return () => Promise.resolve();
        }
        
        return () => {
          throw new Error(`Database connection failed. Please check your DATABASE_URL environment variable. Original error: ${error}`);
        };
      }
    });
  }
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 