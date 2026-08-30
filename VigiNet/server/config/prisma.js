import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from './env.js';

let prismaInstance = null;

const hasDatabaseUrl = typeof config.databaseUrl === 'string' && config.databaseUrl.trim().length > 0;

if (hasDatabaseUrl) {
  try {
    const adapter = new PrismaPg({ connectionString: config.databaseUrl });
    prismaInstance = new PrismaClient({
      adapter,
      log: config.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
    });
  } catch (err) {
    console.warn('[Prisma] Adapter initialization notice:', err.message);
    prismaInstance = null;
  }
}

export const prisma = prismaInstance;

/**
 * Checks whether the PostgreSQL database is reachable with a timeout safeguard.
 * @param {number} timeoutMs
 * @returns {Promise<{ isConnected: boolean, error?: string }>}
 */
export const checkDatabaseConnection = async (timeoutMs = 1500) => {
  if (!prisma || !hasDatabaseUrl) {
    return {
      isConnected: false,
      error: !hasDatabaseUrl ? 'DATABASE_URL is not configured' : 'Prisma client not initialized',
    };
  }

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database connection timeout')), timeoutMs)
    );

    const queryPromise = prisma.$queryRaw`SELECT 1 as result`;
    await Promise.race([queryPromise, timeoutPromise]);
    return { isConnected: true };
  } catch (error) {
    return {
      isConnected: false,
      error: error?.message || 'Database unavailable',
    };
  }
};

export const disconnectPrisma = async () => {
  try {
    if (prisma) {
      await prisma.$disconnect();
    }
  } catch (err) {
    console.error('Error disconnecting Prisma client:', err);
  }
};

process.on('beforeExit', disconnectPrisma);
