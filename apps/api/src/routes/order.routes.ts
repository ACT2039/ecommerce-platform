import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { orderQuerySchema, updateOrderStatusSchema } from '../schemas/order.schema';

const router = Router();

router.use(protect);

// User Routes
router.get('/', validate(orderQuerySchema), orderController.getMyOrders);
router.post('/', orderController.createMyOrder);
router.get('/:id', orderController.getMyOrderById);
router.put('/:id/cancel', orderController.cancelMyOrder);

// Admin Routes
router.use('/admin', restrictTo('ADMIN'));
router.get('/admin/all', validate(orderQuerySchema), orderController.getAllOrders);
router.get('/admin/:id', orderController.getOrderByIdAdmin);
router.put('/admin/:id/status', validate(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;
