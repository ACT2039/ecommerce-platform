import prisma from '../prisma/client';
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePasswords,
  TokenPayload,
} from '../utils/auth';
import { logger } from '../utils/logger';
import { RegisterInput, LoginInput } from '../schemas/authSchemas';

class AuthService {
  /**
   * Register a new user
   */
  async register(input: RegisterInput) {
    const { email, password, name, phone } = input;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { id: phone ? { equals: phone } : undefined }].filter(Boolean),
      },
    });

    if (existingUser) {
      throw new Error('Email or phone already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
      },
    });

    logger.info(`User registered: ${user.email}`);

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token hash
    const tokenHash = await hashPassword(refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user with email/phone and password
   */
  async login(input: LoginInput) {
    const { emailOrPhone, password } = input;

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });

    if (!user) {
      throw new Error('Invalid email/phone or password');
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email/phone or password');
    }

    logger.info(`User logged in: ${user.email}`);

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token hash
    const tokenHash = await hashPassword(refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string, userId: string) {
    // Verify refresh token hash exists and is not revoked
    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      throw new Error('Invalid or expired refresh token');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    logger.info(`Token refreshed for user: ${user.email}`);

    // Generate new access token
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);

    return { accessToken };
  }

  /**
   * Logout user (revoke refresh token)
   */
  async logout(userId: string) {
    await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });

    logger.info(`User logged out: ${userId}`);
  }
}

export default new AuthService();
