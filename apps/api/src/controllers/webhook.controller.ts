import { Request, Response } from 'express';
import * as webhookService from '../services/webhook.service';
import { catchAsync } from '../utils/catchAsync';

export const handleStripe = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  // We configured express.json in app.ts to store rawBody for webhooks
  const rawBody = (req as any).rawBody;

  if (!signature || !rawBody) {
    return res.status(400).send('Missing stripe signature or raw body');
  }

  const result = await webhookService.handleStripeWebhook(rawBody, signature);
  
  res.status(200).json(result);
});
