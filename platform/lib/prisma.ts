/**
 * Prisma Client Singleton
 * 
 * Ensures only one Prisma Client instance is created
 * Prevents connection pool exhaustion in development
 * 
 * @author Amelia (Lead Dev)
 * @sprint Sprint 2
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

