import dotenv from 'dotenv';

dotenv.config();

const parseAllowedOrigins = () => {
  const configured = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://localhost:5175')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaults = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

  return [...new Set([...configured, ...defaults])];
};

export const config = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/viginet?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'development-secret-change-me',
  corsOrigin: parseAllowedOrigins(),
  storageProvider: process.env.STORAGE_PROVIDER || 'local',
  localStorageDir: process.env.LOCAL_STORAGE_DIR || './storage',
};
