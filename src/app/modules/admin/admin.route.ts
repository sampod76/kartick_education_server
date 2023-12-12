import express from 'express';

import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validations';

const router = express.Router();
router
  .route('/')
  .get(authMiddleware(ENUM_USER_ROLE.ADMIN), AdminController.getAllAdmins)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(AdminValidation.createAdminZodSchema),
    AdminController.createAdmin
  );

router
  .route('/:id')
  .get(authMiddleware(ENUM_USER_ROLE.ADMIN), AdminController.getSingleAdmin)
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(AdminValidation.updateAdminZodSchema),
    AdminController.updateAdmin
  )
  .delete(authMiddleware(ENUM_USER_ROLE.ADMIN), AdminController.deleteAdmin);

export const AdminRoutes = router;
