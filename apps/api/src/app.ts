import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

export function createServer() {
  const app = express();
  
  // Trust proxy for secure cookies behind load balancers (e.g., Render, Heroku)
  app.set('trust proxy', 1);

  // Security Headers
  app.use(helmet());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 10000, // High limit for dev to prevent 429s during hot-reloads
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Too many requests, please try again later.' }
  });
  // Apply the rate limiting middleware to API calls only
  app.use('/api', limiter);

  // Logging
  const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));

  // CORS Policy (Dynamic for production vs local)
  // We use origin: true to allow any origin (e.g. Vercel preview domains) to connect and send credentials
  app.use(cors({ 
    origin: true,
    credentials: true 
  }));

  app.use(express.json({
    verify: (req: any, res, buf) => {
      if (req.originalUrl.startsWith('/api/webhooks')) {
        req.rawBody = buf;
      }
    }
  }));
  app.use(cookieParser());
  
  // Serve static files from public directory
  app.use(express.static('public'));

  app.use('/api', routes);

  app.use(errorHandler);

  return app;
}
