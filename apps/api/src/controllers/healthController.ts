import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { exec } from 'child_process';

const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'success',
      message: 'API is running optimally',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'API is running but database connection failed',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
};

export const seedDatabase = (req: Request, res: Response) => {
  exec('node prisma/seed.js', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }
    res.status(200).json({ message: 'Seed executed successfully', stdout });
  });
};

export default healthCheck;
