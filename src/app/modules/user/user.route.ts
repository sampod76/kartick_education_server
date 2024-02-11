import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.get(
  '/',
  authMiddleware(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.MODERATOR,
    ENUM_USER_ROLE.SELLER,
  ),
  UserController.getUsers,
);
router
  .route('/:id')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.MODERATOR,
      ENUM_USER_ROLE.SELLER,
    ),
    UserController.getSingleUser,
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    UserController.deleteSingleUser,
  );

router.post(
  '/create-student',
  validateRequestZod(UserValidation.createStudentZodSchema),
  UserController.createStudent,
);
router.post(
  '/create-student-author',
  authMiddleware(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.MODERATOR,
    ENUM_USER_ROLE.SELLER,
  ),
  validateRequestZod(UserValidation.createStudentZodSchema),
  UserController.createStudentByAuthor,
);

router.post(
  '/create-moderator',
  authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequestZod(UserValidation.createModeratorZodSchema),
  UserController.createModerator,
);

router.post(
  '/create-admin',
  authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequestZod(UserValidation.createAdminZodSchema),
  UserController.createAdmin,
);
router.post(
  '/create-seller',
  // authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequestZod(UserValidation.createSellerZodSchema),
  UserController.createSeller,
);
router.post(
  '/create-trainer',
  authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequestZod(UserValidation.createTrainerZodSchema),
  UserController.createTrainer,
);

router.patch(
  '/:id',
  authMiddleware(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.TEACHER,
    ENUM_USER_ROLE.SELLER,
  ),
  UserController.updateUser,
);

export const UserRoutes = router;
