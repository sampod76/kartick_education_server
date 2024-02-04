import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { GlossaryController } from './glossary.constroller';
import { GlossaryValidation } from './glossary.validation';

const router = express.Router();

router
  .route('/')
  .get(GlossaryController.getAllGlossary)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(GlossaryValidation.createGlossaryZodSchema),
    GlossaryController.createGlossary
  );

router
  .route('/:id')
  .get(GlossaryController.getSingleGlossary)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(GlossaryValidation.updateGlossaryZodSchema),
    GlossaryController.updateGlossary
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    GlossaryController.deleteGlossary
  );

export const GlossaryRoute = router;
