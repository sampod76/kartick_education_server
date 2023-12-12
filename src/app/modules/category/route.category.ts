import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { CategoryController } from './constroller.category';
import { CategoryValidation } from './validation.category';

const router = express.Router();

router
  .route('/')
  // This route is open
  .get(CategoryController.getAllCategory)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(CategoryValidation.createCategoryZodSchema),
    CategoryController.createCategory
  );

router
  .route('/:id')
  // This route is open
  .get(CategoryController.getSingleCategory)
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(CategoryValidation.updateCategoryZodSchema),
    CategoryController.updateCategory
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    CategoryController.deleteCategory
  );

export const CategoryRoute = router;
