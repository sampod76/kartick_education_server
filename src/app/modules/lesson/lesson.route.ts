import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { ModuleController } from './lesson.constroller';
import { moduleValidation } from './lesson.validation';

const router = express.Router();

router
  .route('/')
  .get(ModuleController.getAllModule)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(moduleValidation.createModuleZodSchema),
    ModuleController.createModule
  );

router
  .route('/:id')
  .get(ModuleController.getSingleModule)
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(moduleValidation.updateModuleZodSchema),
    ModuleController.updateModule
  )
  .delete(authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN), ModuleController.deleteModule);

export const ModuleRoute = router;
