import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { ContactMailController } from './constroller.contactMail';
import { ContactMailValidation } from './validation.contactMail';

const router = express.Router();

router
  .route('/')
  // This route is open
  .get(ContactMailController.getAllContactMail)
  .post(
    // authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(ContactMailValidation.createContactMailZodSchema),
    ContactMailController.createContactMail
  );





router
  .route('/:id')
  // This route is open
  .get(ContactMailController.getSingleContactMail)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(ContactMailValidation.updateContactMailZodSchema),
    ContactMailController.updateContactMail
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
    ContactMailController.deleteContactMail
  );

export const ContactMailRoute = router;
