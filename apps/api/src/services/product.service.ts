import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';
import { Prisma } from '@prisma/client';

const generateSlug = (title: string) => {
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`; // Ensure uniqueness easily for MVP
};

export const getProducts = async (query: any) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    deletedAt: null,
  };

  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    
    // Mock AI Semantic Search Keyword Expansion
    let searchTerms = [query.search];
    if (searchTerm.includes('shirt')) {
      searchTerms = ['shirt', 't-shirt', 'apparel', 'fashion', 'clothing', 'top'];
    } else if (searchTerm.includes('shoe') || searchTerm.includes('sneaker')) {
      searchTerms = ['shoe', 'sneaker', 'footwear', 'kicks'];
    }

    where.OR = searchTerms.map(term => ({
      title: { contains: term, mode: 'insensitive' }
    }));
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = query.minPrice;
    if (query.maxPrice) where.price.lte = query.maxPrice;
  }

  if (query.brand) {
    where.brand = { equals: query.brand, mode: 'insensitive' };
  }

  if (query.inStock) {
    where.inventory = { quantity: { gt: 0 } };
  }

  if (query.category) {
    where.categories = {
      some: {
        category: {
          slug: query.category,
        },
      },
    };
  }

  // Build orderBy
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }; // default newest
  if (query.sort === 'price_asc') orderBy = { price: 'asc' };
  if (query.sort === 'price_desc') orderBy = { price: 'desc' };
  // Note: rating sorting would require aggregating reviews, keeping it simple for MVP or sorting after fetching if needed.
  // For MVP we will just skip rating sort or implement basic

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1, // Only get main image for listing
        },
        inventory: {
          select: { quantity: true },
        },
        categories: {
          include: { category: { select: { name: true, slug: true } } },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: { slug, isPublished: true, deletedAt: null },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      inventory: true,
      categories: {
        include: { category: { select: { id: true, name: true, slug: true } } },
      },
      reviews: {
        where: { deletedAt: null },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

export const createProduct = async (data: any) => {
  const { title, description, sku, price, compareAtPrice, brand, categoryIds, inventoryQuantity, images } = data;
  const slug = generateSlug(title);

  const product = await prisma.$transaction(async (tx) => {
    // 1. Create Product
    const newProduct = await tx.product.create({
      data: {
        title,
        slug,
        description,
        sku,
        price,
        compareAtPrice,
        brand,
        // 2. Link Categories
        categories: categoryIds ? {
          create: categoryIds.map((id: string) => ({
            category: { connect: { id } }
          }))
        } : undefined,
        // 3. Create Images
        images: images ? {
          create: images.map((url: string, index: number) => ({
            url,
            sortOrder: index,
          }))
        } : undefined,
        // 4. Create Inventory
        inventory: {
          create: {
            quantity: inventoryQuantity || 0,
            sku,
          }
        }
      },
      include: {
        images: true,
        inventory: true,
        categories: true,
      }
    });

    return newProduct;
  });

  return product;
};

export const updateProduct = async (id: string, data: any) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError('Product not found', 404);

  const { categoryIds, inventoryQuantity, images, title, ...restData } = data;
  
  let slug: string | undefined;
  if (title) {
    slug = generateSlug(title);
  }

  const updatedProduct = await prisma.$transaction(async (tx) => {
    // Handle inventory update
    if (inventoryQuantity !== undefined) {
      await tx.inventory.update({
        where: { productId: id },
        data: { quantity: inventoryQuantity },
      });
    }

    // Handle images update (replace all for simplicity in MVP)
    if (images !== undefined) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({
        data: images.map((url: string, idx: number) => ({
          productId: id,
          url,
          sortOrder: idx,
        })),
      });
    }

    // Handle categories update (replace all)
    if (categoryIds !== undefined) {
      await tx.productCategory.deleteMany({ where: { productId: id } });
      if (categoryIds.length > 0) {
        await tx.productCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            productId: id,
            categoryId,
          })),
        });
      }
    }

    // Update main product data
    return await tx.product.update({
      where: { id },
      data: {
        title,
        slug,
        ...restData,
      },
      include: {
        images: true,
        inventory: true,
        categories: true,
      }
    });
  });

  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date(), isPublished: false },
  });
};
