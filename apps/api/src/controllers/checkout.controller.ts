import { Request, Response } from 'express';
import * as checkoutService from '../services/checkout.service';
import { catchAsync } from '../utils/catchAsync';

export const createCheckoutIntent = catchAsync(async (req: Request, res: Response) => {
  const { shippingAddressId, billingAddressId } = req.body;
  
  const session = await checkoutService.createCheckoutSession(
    req.user!.id,
    shippingAddressId,
    billingAddressId
  );

  res.status(200).json({
    status: 'success',
    data: session,
  });
});
