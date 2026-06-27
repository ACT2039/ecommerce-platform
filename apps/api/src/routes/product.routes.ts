import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from '../schemas/product.schema';

const router = Router();

// Public routes
router.get('/', validate(productQuerySchema), productController.getProducts);
router.get('/:slug', productController.getProduct);

// Admin only routes
router.use(protect, restrictTo('ADMIN'));

router.post('/', validate(createProductSchema), productController.createProduct);
router.put('/:id', validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
