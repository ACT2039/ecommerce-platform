import { Request, Response } from 'express';
import * as addressService from '../services/address.service';
import { catchAsync } from '../utils/catchAsync';

export const createAddress = catchAsync(async (req: Request, res: Response) => {
  const address = await addressService.createAddress(req.user!.id, req.body);

  res.status(201).json({
    status: 'success',
    data: { address },
  });
});

export const getAddresses = catchAsync(async (req: Request, res: Response) => {
  const addresses = await addressService.getAddresses(req.user!.id);

  res.status(200).json({
    status: 'success',
    results: addresses.length,
    data: { addresses },
  });
});

export const updateAddress = catchAsync(async (req: Request, res: Response) => {
  const address = await addressService.updateAddress(req.params.id, req.user!.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { address },
  });
});

export const deleteAddress = catchAsync(async (req: Request, res: Response) => {
  await addressService.deleteAddress(req.params.id, req.user!.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
