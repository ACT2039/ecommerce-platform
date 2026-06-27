import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import * as userAdminController from '../controllers/user.admin.controller';
import * as couponController from '../controllers/coupon.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Secure all admin routes
router.use(protect);
router.use(restrictTo('ADMIN'));

// Analytics
router.get('/analytics/dashboard', analyticsController.getDashboardStats);

// Users Management
router.get('/users', userAdminController.getAllUsers);
router.put('/users/:id/role', userAdminController.updateUserRole);
router.delete('/users/:id', userAdminController.deleteUser);

// Coupons Management
router.post('/coupons', couponController.createCoupon);
router.get('/coupons', couponController.getAllCoupons);
router.delete('/coupons/:id', couponController.deleteCoupon);

export default router;
