import express from 'express';

import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { SellerController } from './seller.controller';
import { SellerValidation } from './seller.validation';
const router = express.Router();

router
  .route('/')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    SellerController.getAllSellers
  );

router
  .route('/:id')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.SELLER),
    SellerController.getSingleSeller
  )
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.SELLER),
    validateRequestZod(SellerValidation.updateSeller),
    SellerController.updateSeller
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.SUPER_ADMIN),
    SellerController.deleteSeller
  );

export const SellerRoutes = router;
