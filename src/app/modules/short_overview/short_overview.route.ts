import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { Short_overviewController } from './short_overview.constroller';
import { Short_overviewValidation } from './short_overview.validation';

const router = express.Router();

router
  .route('/')
  .get(Short_overviewController.getAllShort_overview)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(Short_overviewValidation.createShort_overviewZodSchema),
    Short_overviewController.createShort_overview,
  );

router
  .route('/:id')
  .get(Short_overviewController.getSingleShort_overview)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(Short_overviewValidation.updateShort_overviewZodSchema),
    Short_overviewController.updateShort_overview,
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    Short_overviewController.deleteShort_overview,
  );

export const Short_overviewRoute = router;
