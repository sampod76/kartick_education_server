import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { Purchase_categoryController } from './purchase_category.controller';
import { Purchase_categoryValidation } from './purchase_category.validation';

const router = express.Router();

router
  .route('/')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.STUDENT,
      ENUM_USER_ROLE.SELLER,
    ),
    Purchase_categoryController.getAllCategoryPurchase,
  )
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT,
      ENUM_USER_ROLE.SELLER,
    ),
    validateRequestZod(
      Purchase_categoryValidation.createPurchase_categoryZodSchema,
    ),
    Purchase_categoryController.createPurchase_category,
  );

router
  .route('/purchase-and-pending-categories')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT,
      ENUM_USER_ROLE.SELLER,
    ),
    Purchase_categoryController.getAllPurchaseAndPendingCategorys,
  );
router
  .route('/purchase-and-pending-categories/:id')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT,
      ENUM_USER_ROLE.SELLER,
    ),
    Purchase_categoryController.getSinglePurchaseAndPendingCategorys,
  );
router
  .route('/total-amount')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT,
      ENUM_USER_ROLE.SELLER,
    ),
    Purchase_categoryController.getAllCategoryPurchaseTotalAmount,
  );

router
  .route('/:id')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT,
      ENUM_USER_ROLE.SELLER,
    ),
    Purchase_categoryController.getSingleCategoryPurchase,
  )
  .delete(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT,
      ENUM_USER_ROLE.SELLER,
    ),
    Purchase_categoryController.deleteCategoryPurchase,
  )
  .patch(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT,
      ENUM_USER_ROLE.SELLER,
    ),
    Purchase_categoryController.updatePurchase_category,
  );

export const Purchase_categoryRoute = router;
