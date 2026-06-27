import { prisma } from '../prisma/client';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError';
import { signToken } from '../utils/jwt';

export const register = async (data: any) => {
  const { name, email, password, phone } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  const token = signToken({ id: user.id });

  return { user, token };
};

export const login = async (credentials: any) => {
  const { email, phone, emailOrPhone, password } = credentials;

  // Determine what to search for
  let searchEmail = email;
  let searchPhone = phone;

  if (emailOrPhone) {
    if (emailOrPhone.includes('@')) {
      searchEmail = emailOrPhone;
    } else {
      searchPhone = emailOrPhone;
    }
  }

  const orConditions: any[] = [];
  if (searchEmail) orConditions.push({ email: searchEmail });
  if (searchPhone) orConditions.push({ phone: searchPhone });

  if (orConditions.length === 0) {
    throw new AppError('Email or phone is required', 400);
  }

  // Find user by email or phone
  const user = await prisma.user.findFirst({
    where: {
      OR: orConditions,
    },
  });

  if (!user || !user.password) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = signToken({ id: user.id });

  // Remove password from output
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};
