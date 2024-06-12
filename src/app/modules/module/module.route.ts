import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { ModuleController } from './module.constroller';
import { moduleValidation } from './module.validation';

const router = express.Router();

router
  .route('/')
  .get(ModuleController.getAllModule)
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    validateRequestZod(moduleValidation.createModuleZodSchema),
    ModuleController.createModule,
  );

router
  .route('/:id')
  .get(ModuleController.getSingleModule)
  .patch(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    validateRequestZod(moduleValidation.updateModuleZodSchema),
    ModuleController.updateModule,
  )
  .delete(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    ModuleController.deleteModule,
  );

export const ModuleRoute = router;
