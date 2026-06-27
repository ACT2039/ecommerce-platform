const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding minimal data...');

  const category = await prisma.category.upsert({
    where: { slug: 'default' },
    update: {},
    create: { name: 'Default', slug: 'default' }
  });

  const product = await prisma.product.upsert({
    where: { slug: 'sample-product' },
    update: {},
    create: {
      title: 'Sample Product',
      slug: 'sample-product',
      description: 'Starter product for development',
      price: '19.99',
      currency: 'USD',
      images: { create: [{ url: 'https://placehold.co/600x400', altText: 'Sample' }] }
    }
  });

  await prisma.inventory.upsert({
    where: { productId: product.id },
    update: {},
    create: { productId: product.id, quantity: 100, sku: `SAMPLE-${product.id.slice(0,8)}` }
  });

  console.log('Seed finished');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
