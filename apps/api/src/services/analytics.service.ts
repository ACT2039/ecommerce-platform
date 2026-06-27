import { prisma } from '../prisma/client';

export const getDashboardKPIs = async () => {
  // 1. Total Revenue (COMPLETED payments)
  const revenueAggregation = await prisma.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  });
  const totalRevenue = revenueAggregation._sum.amount || 0;

  // 2. Total Orders
  const totalOrders = await prisma.order.count();

  // 3. Low Stock Products (Quantity < LowThreshold or < 10)
  const lowStockProducts = await prisma.inventory.count({
    where: {
      OR: [
        { quantity: { lt: 10 } },
        { lowThreshold: { not: null }, quantity: { lt: prisma.inventory.fields.lowThreshold } }
      ]
    },
  });

  // 4. Total Users
  const totalUsers = await prisma.user.count({ where: { role: 'USER' } });

  // 5. Recent Orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return {
    kpis: {
      totalRevenue,
      totalOrders,
      lowStockProducts,
      totalUsers,
    },
    recentOrders,
  };
};
