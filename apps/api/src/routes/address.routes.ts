import { Router } from 'express';
import * as addressController from '../controllers/address.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createAddressSchema,
  updateAddressSchema,
  deleteAddressSchema,
} from '../schemas/address.schema';

const router = Router();

// All address routes require authentication
router.use(protect);

router.route('/')
  .get(addressController.getAddresses)
  .post(validate(createAddressSchema), addressController.createAddress);

router.route('/:id')
  .put(validate(updateAddressSchema), addressController.updateAddress)
  .delete(validate(deleteAddressSchema), addressController.deleteAddress);

export default router;
