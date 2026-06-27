import prisma from '../prisma/client';
import { hashPassword } from '../utils/auth';
import { UpdateProfileInput, AddressInput } from '../schemas/userSchemas';
import { logger } from '../utils/logger';

class UserService {
  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, input: UpdateProfileInput) {
    // Check if email is already taken
    if (input.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new Error('Email already in use');
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.email && { email: input.email }),
        ...(input.phone !== undefined && { phone: input.phone }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
    });

    logger.info(`User profile updated: ${user.email}`);

    return user;
  }

  /**
   * Get all addresses for user
   */
  async getUserAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create address
   */
  async createAddress(userId: string, input: AddressInput) {
    // If marked as default, unset others
    if (input.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        ...input,
      },
    });

    logger.info(`Address created for user: ${userId}`);

    return address;
  }

  /**
   * Update address
   */
  async updateAddress(userId: string, addressId: string, input: AddressInput) {
    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    // If marked as default, unset others
    if (input.isDefault && !address.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id: addressId },
      data: input,
    });

    logger.info(`Address updated: ${addressId}`);

    return updated;
  }

  /**
   * Delete address
   */
  async deleteAddress(userId: string, addressId: string) {
    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    logger.info(`Address deleted: ${addressId}`);
  }

  /**
   * Get single address
   */
  async getAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    return address;
  }
}

export default new UserService();
