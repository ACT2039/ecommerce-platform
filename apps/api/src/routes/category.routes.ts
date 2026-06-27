import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from '../schemas/category.schema';

const router = Router();

// Public routes
router.get('/', categoryController.getCategories);

// Admin only routes
router.use(protect, restrictTo('ADMIN'));

router.post('/', validate(createCategorySchema), categoryController.createCategory);
router.put('/:id', validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', validate(deleteCategorySchema), categoryController.deleteCategory);

export default router;
