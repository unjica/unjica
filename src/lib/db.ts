import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Validate and fix DATABASE_URL if needed
const validateDatabaseUrl = () => {
  const dbUrl = process.env.API_URL || '';
  
  // Check if DATABASE_URL is properly formatted
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    console.warn('DATABASE_URL does not start with postgresql:// or postgres://, attempting to fix...');
    
    // Try to fix the URL by adding the protocol
    if (dbUrl.includes('@') && dbUrl.includes(':')) {
      // It looks like a database URL without protocol, try to add it
      const fixedUrl = `postgresql://${dbUrl}`;
      console.log('Fixed DATABASE_URL:', fixedUrl.replace(/:[^:]*@/, ':****@'));
      process.env.API_URL = fixedUrl;
    } else {
      console.error('DATABASE_URL is invalid and cannot be automatically fixed. Please check your environment variables.');
    }
  }
};

// Create a new Prisma client with logging in development
const createPrismaClient = () => {
  // Validate DATABASE_URL before creating the client
  validateDatabaseUrl();
  
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