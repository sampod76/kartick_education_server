
import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { ModuleController } from './module.controller';
import {ModuleValidation } from './module.validation';

const router = express.Router();

router
  .route('/')
  .get(ModuleController.getAllModule)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(ModuleValidation.createModuleZodSchema),
    ModuleController.createModule
  );

router
  .route('/:id')
  .get(ModuleController.getSingleModule)
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(ModuleValidation.updateModuleZodSchema),
    ModuleController.updateModule
  )
  .delete(authMiddleware(ENUM_USER_ROLE.ADMIN), ModuleController.deleteModule);

export const ModuleRoutes = router;
