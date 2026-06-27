import { Request, Response } from 'express';
import * as orderService from '../services/order.service';
import { catchAsync } from '../utils/catchAsync';

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.getUserOrders(req.user!.id, req.query);
  res.status(200).json({ status: 'success', data: result });
});

export const createMyOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.user!.id, req.body);
  res.status(201).json({ status: 'success', data: order });
});

export const getMyOrderById = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.user!.id, req.params.id, false);
  res.status(200).json({ status: 'success', data: order });
});

export const cancelMyOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.cancelOrder(req.user!.id, req.params.id);
  res.status(200).json({ status: 'success', data: order });
});

// Admin Controllers
export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.getAllOrders(req.query);
  res.status(200).json({ status: 'success', data: result });
});

export const getOrderByIdAdmin = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.user!.id, req.params.id, true);
  res.status(200).json({ status: 'success', data: order });
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.status(200).json({ status: 'success', data: order });
});
