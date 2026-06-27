import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { wishlistSchema } from '../schemas/wishlist.schema';

const router = Router();

// All wishlist routes require authentication
router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/:productId', validate(wishlistSchema), wishlistController.addToWishlist);
router.delete('/:productId', validate(wishlistSchema), wishlistController.removeFromWishlist);

export default router;
