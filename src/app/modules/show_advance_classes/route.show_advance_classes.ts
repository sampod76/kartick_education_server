import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { Show_advance_classesController } from './constroller.show_advance_classes';
import { Show_advance_classesValidation } from './validation.show_advance_classes';

const router = express.Router();

router
  .route('/')
  .get(Show_advance_classesController.getAllShow_advance_classes)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(
      Show_advance_classesValidation.createShow_advance_classesZodSchema,
    ),
    Show_advance_classesController.createShow_advance_classes,
  );

router
  .route('/:id')
  .get(Show_advance_classesController.getSingleShow_advance_classes)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(
      Show_advance_classesValidation.updateShow_advance_classesZodSchema,
    ),
    Show_advance_classesController.updateShow_advance_classes,
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    Show_advance_classesController.deleteShow_advance_classes,
  );

export const Show_advance_classesRoute = router;
