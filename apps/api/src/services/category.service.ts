import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';

export const getCategories = async () => {
  // Fetch root categories with their children
  return await prisma.category.findMany({
    where: { parentId: null, deletedAt: null },
    include: {
      children: {
        where: { deletedAt: null },
        include: {
          children: true, // You can nest further if needed
        },
      },
    },
  });
};

const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export const createCategory = async (data: any) => {
  const slug = generateSlug(data.name);

  // Check if slug exists
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    throw new AppError('Category with this name already exists', 400);
  }

  return await prisma.category.create({
    data: {
      name: data.name,
      slug,
      parentId: data.parentId || null,
    },
  });
};

export const updateCategory = async (id: string, data: any) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  const updateData: any = { ...data };
  if (data.name) {
    updateData.slug = generateSlug(data.name);
  }

  return await prisma.category.update({
    where: { id },
    data: updateData,
  });
};

export const deleteCategory = async (id: string) => {
  // Soft delete
  return await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
