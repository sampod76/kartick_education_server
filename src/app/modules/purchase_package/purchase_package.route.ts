import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { PurchasePackageController } from './purchase_package.controller';
import { PurchasePackageValidation } from './purchase_package.validation';

const router = express.Router();

router
  .route('/')
  .get(PurchasePackageController.getAllPackagePurchase)
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT,
    ),
    validateRequestZod(
      PurchasePackageValidation.createPurchasePackageZodSchema,
    ),
    PurchasePackageController.createPurchasePackage,
  );
router
  .route('/purchase-and-pending-package')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT,
    ),
    PurchasePackageController.getAllPackagePurchasePendingPackage,
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
    PurchasePackageController.getSinglePackagePurchase,
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    PurchasePackageController.deletePackagePurchase,
  )
  .patch(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    PurchasePackageController.updatePurchasePackage,
  );

export const PurchasePackageRoute = router;
