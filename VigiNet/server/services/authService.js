import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import { prisma, checkDatabaseConnection } from '../config/prisma.js';

export const hashPassword = async (password) => {
  if (!password) throw new Error('Password is required for hashing');
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
};

export const issueToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

export const registerUser = async (data) => {
  const { email, password, role = 'CITIZEN', fullName, village, district, preferredLang, designation, teamId } = data;

  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const { isConnected } = await checkDatabaseConnection();

  if (!isConnected) {
    // Development fallback response when database is offline
    const hashedPassword = await hashPassword(password);
    const mockUser = {
      id: `USR-${Date.now()}`,
      email,
      role,
      fullName: fullName || 'Demo User',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    return {
      token: issueToken(mockUser),
      user: mockUser,
      mode: 'development-fallback',
    };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    const error = new Error('User already exists with this email address.');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      ...(role === 'CITIZEN'
        ? {
            citizenProfile: {
              create: {
                fullName,
                village,
                district,
                preferredLang,
              },
            },
          }
        : {
            responderProfile: {
              create: {
                fullName,
                designation,
                teamId,
              },
            },
          }),
    },
    include: {
      citizenProfile: true,
      responderProfile: true,
    },
  });

  const safeUser = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    isActive: newUser.isActive,
    profile: newUser.citizenProfile || newUser.responderProfile || null,
    createdAt: newUser.createdAt,
  };

  const token = issueToken(safeUser);
  return { token, user: safeUser };
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const { isConnected } = await checkDatabaseConnection();

  if (!isConnected) {
    // Development fallback
    const mockUser = {
      id: 'USR-DEV-1',
      email,
      role: email.includes('responder') ? 'FIELD_RESPONDER' : email.includes('admin') ? 'ADMIN' : 'CITIZEN',
      fullName: 'Development User',
    };
    return {
      token: issueToken(mockUser),
      user: mockUser,
      mode: 'development-fallback',
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      citizenProfile: true,
      responderProfile: true,
    },
  });

  if (!user || !user.passwordHash) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    profile: user.citizenProfile || user.responderProfile || null,
    createdAt: user.createdAt,
  };

  const token = issueToken(safeUser);
  return { token, user: safeUser };
};

export const getCurrentUser = async (userId) => {
  if (!userId) throw new Error('User ID is required');

  const { isConnected } = await checkDatabaseConnection();
  if (!isConnected) {
    return {
      id: userId,
      email: 'user@viginet.internal',
      role: 'CITIZEN',
      mode: 'development-fallback',
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      citizenProfile: true,
      responderProfile: true,
    },
  });

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    profile: user.citizenProfile || user.responderProfile || null,
    createdAt: user.createdAt,
  };
};
