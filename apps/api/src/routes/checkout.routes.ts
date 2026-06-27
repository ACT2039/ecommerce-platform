import { Router } from 'express';
import * as checkoutController from '../controllers/checkout.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCheckoutSessionSchema } from '../schemas/checkout.schema';

const router = Router();

// All checkout routes require authentication
router.use(protect);

router.post('/intent', validate(createCheckoutSessionSchema), checkoutController.createCheckoutIntent);

export default router;
