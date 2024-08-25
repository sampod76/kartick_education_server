import express from 'express';
import { uploadVideoFile } from '../../middlewares/uploader.multer';
import { HomeVideoController } from './controller.homeVideoUplaode';

const router = express.Router();

router
  .route('/')
  // This route is open
  .get(HomeVideoController.getAllVideo)
  .post(uploadVideoFile, HomeVideoController.uploadVideoDataInDB);

router.route('/:id').get(HomeVideoController.getSingleVideoFromDB);

// router
//   .route('/:id')
//   // This route is open
//   .get(ContactMailController.getSingleContactMail)
//   .patch(
//     authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
//     validateRequestZod(ContactMailValidation.updateContactMailZodSchema),
//     ContactMailController.updateContactMail
//   )
//   .delete(
//     authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
//     ContactMailController.deleteContactMail
//   );

export const HomeVideoRoute = router;
