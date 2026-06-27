import { Router } from 'express';
import healthCheck, { seedDatabase } from '../controllers/healthController';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import addressRoutes from './address.routes';
import uploadRoutes from './upload.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import wishlistRoutes from './wishlist.routes';
import checkoutRoutes from './checkout.routes';
import webhookRoutes from './webhook.routes';
import orderRoutes from './order.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Health check & Seeding
router.get('/health', healthCheck);
router.post('/seed', seedDatabase);

// Global Admin Routes
router.use('/admin', adminRoutes);

// Catalog routes
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

// Cart & Wishlist routes
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);

// Checkout & Payment routes
router.use('/checkout', checkoutRoutes);
router.use('/webhooks', webhookRoutes);

// Order routes
router.use('/orders', orderRoutes);

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Address routes
router.use('/addresses', addressRoutes);

// Upload routes (Admin only)
router.use('/upload', uploadRoutes);

export default router;
