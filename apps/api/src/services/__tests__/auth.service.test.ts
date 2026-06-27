import { login, register } from '../auth.service';
import { prisma } from '../../prisma/client';
import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/AppError';

// Mock the prisma client
jest.mock('../../prisma/client', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  }
}));

describe('Auth Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, JWT_SECRET: 'testsecret1234567890' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('login', () => {
    it('should throw an error if user is not found', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(login({ email: 'nonexistent@example.com', password: 'password' })).rejects.toThrow(AppError);
      await expect(login({ email: 'nonexistent@example.com', password: 'password' })).rejects.toMatchObject({ message: 'Invalid credentials', statusCode: 401 });
    });

    it('should throw an error if password does not match', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('correctpassword', 10),
      };
      
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      await expect(login({ email: 'test@example.com', password: 'wrongpassword' })).rejects.toThrow(AppError);
    });

    it('should return user and token if credentials are valid', async () => {
      const password = 'correctpassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        password: hashedPassword,
      };
      
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await login({ email: 'test@example.com', password });

      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('id', '1');
      expect(result.user).toHaveProperty('email', 'test@example.com');
      expect(result.user).not.toHaveProperty('password');
    });
  });
});
