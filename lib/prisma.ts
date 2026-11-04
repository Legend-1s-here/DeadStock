import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// On Vercel serverless environments, copy pre-seeded SQLite dev.db to /tmp for read/write access
if (process.env.VERCEL) {
  const tmpDb = '/tmp/dev.db';
  if (!fs.existsSync(tmpDb)) {
    const bundledDb = path.join(process.cwd(), 'prisma', 'dev.db');
    if (fs.existsSync(bundledDb)) {
      try {
        fs.copyFileSync(bundledDb, tmpDb);
      } catch (e) {
        console.error('Failed to copy bundled db to /tmp:', e);
      }
    }
  }
  process.env.DATABASE_URL = 'file:/tmp/dev.db';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
