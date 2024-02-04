import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { PackageController } from './package.controller';
import { PackageValidation } from './package.validation';

const router = express.Router();

router
  .route('/')
  .get(PackageController.getAllPackage)
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      // ENUM_USER_ROLE.STUDENT,  // if future student is allowed
      ENUM_USER_ROLE.SELLER,
    ),
    validateRequestZod(PackageValidation.createPackageZodSchema),
    PackageController.createPackage,
  );

router
  .route('/:id')
  .get(PackageController.getSinglePackage)
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    PackageController.deletePackage,
  )
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    PackageController.updatePackage,
  );

router
  .route('/increment/:id')
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    PackageController.increaseStudentPackage,
  );

export const PackageRoute = router;
