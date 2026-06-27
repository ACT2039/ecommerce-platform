import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Attempt a lightweight database query
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: 'Connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
    });
  }
};

export default healthCheck;
