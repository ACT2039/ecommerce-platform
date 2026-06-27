import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('ERROR 💥:', err);
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    error = new AppError(message, 400);
  }

  // Prisma Errors (simplified mapping)
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again!';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your token has expired! Please log in again.';
    error = new AppError(message, 401);
  }

  const statusCode = error.statusCode || err.statusCode || 500;
  const status = error.status || err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    // Operational, trusted error: send message to client
    if (error.isOperational) {
      res.status(statusCode).json({
        status,
        message: error.message,
      });
    } else {
      // Programming or other unknown error: don't leak error details
      console.error('ERROR 💥:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  } else {
    // Development: send full error
    res.status(statusCode).json({
      status,
      message: error.message,
      error: err,
      stack: err.stack,
    });
  }
};
