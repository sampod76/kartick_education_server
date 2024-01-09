import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { ResourceController } from './resource.constroller';
import { ResourceValidation } from './resource.validation';

const router = express.Router();

router
  .route('/')
  .get(ResourceController.getAllResource)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(ResourceValidation.createResourceZodSchema),
    ResourceController.createResource
  );

router
  .route('/:id')
  .get(ResourceController.getSingleResource)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(ResourceValidation.updateResourceZodSchema),
    ResourceController.updateResource
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    ResourceController.deleteResource
  );

export const ResourceRoute = router;
