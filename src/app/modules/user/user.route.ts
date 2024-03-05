import express from 'express';
import { UserController } from './user.controller';

import { UserValidation } from './user.validation';
import validateRequestZod from '../../middlewares/validateRequestZod';

const router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getSingleUser);
router.post(
  '/create-user',
  validateRequestZod(UserValidation.createUserZodSchema),
  UserController.createUser,
);
router.patch(
  '/:id',
  validateRequestZod(UserValidation.updateUserZodSchema),
  UserController.updateUser,
);
router.delete('/:id', UserController.deleteUser);

export const userRoutes = router;
