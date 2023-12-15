import express from 'express';

import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';
import validateRequestZod from '../../middlewares/validateRequestZod';
import authMiddleware from '../../middlewares/authMiddleware';
import { ENUM_USER_ROLE } from '../../../enums/users';
const router = express.Router();

router
  .route('/')
  .get( authMiddleware(ENUM_USER_ROLE.ADMIN,"super_admin"), AdminController.getAllAdmins)


router
  .route('/:id')
  .get( authMiddleware(ENUM_USER_ROLE.ADMIN,"super_admin"),AdminController.getSingleAdmin)
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN,"super_admin"),
    validateRequestZod(AdminValidation.updateAdmin),
    AdminController.updateAdmin
  )
  .delete(authMiddleware("super_admin"), AdminController.deleteAdmin);
  

export const AdminRoutes = router;
