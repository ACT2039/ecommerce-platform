import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  addToCartSchema,
  updateCartItemSchema,
  deleteCartItemSchema,
} from '../schemas/cart.schema';

const router = Router();

// All cart routes require authentication
router.use(protect);

router.get('/', cartController.getCart);
router.post('/items', validate(addToCartSchema), cartController.addToCart);
router.put('/items/:id', validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/items/:id', validate(deleteCartItemSchema), cartController.removeCartItem);
router.delete('/', cartController.clearCart);

export default router;
