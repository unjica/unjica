import { PrismaClient } from '@prisma/client'

declare module '@prisma/client' {
  interface PrismaClient {
    comment: any;
    reaction: any;
    subscriber: any;
  }
}

export {} 