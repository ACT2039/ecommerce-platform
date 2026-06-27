import { Router } from 'express';
import * as webhookController from '../controllers/webhook.controller';

const router = Router();

router.post('/stripe', webhookController.handleStripe);

export default router;
