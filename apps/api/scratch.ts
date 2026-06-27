import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const usersCount = await prisma.user.count();
  console.log(`Found ${usersCount} users. Deleting all users...`);
  await prisma.user.deleteMany({});
  console.log('All users successfully deleted.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
