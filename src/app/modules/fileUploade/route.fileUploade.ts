import express from 'express';
// import authMiddleware from '../../middlewares/authMiddleware';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import {
  uploadAudioFile,
  uploadPdfFile,
  uploadVideoFile,
} from '../../middlewares/uploader.multer';
import { FileUploadHelper } from '../../middlewares/uploderCloudinary';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { FileUploadeController } from './constroller.fileUploade';
import { FileUploadeValidation } from './validation.fileUploade';

const router = express.Router();

router.route('/upload-single-image').post(
  authMiddleware(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.STUDENT,
  ),
  // uploadSingleImage,
  FileUploadHelper.upload.single('image'),
  FileUploadeController.uploadeSingleFileByServer,
  // FileUploadHelper.uploadToCloudinary,
);
router.route('/upload-single-image-ant-form').post(
  authMiddleware(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.STUDENT,
  ),
  // uploadSingleImage,
  FileUploadHelper.upload.single('image'),
  FileUploadeController.uploadeSingleFileByServer,
  // FileUploadHelper.uploadToCloudinary,
);

router
  .route('/upload-profile-image')
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SELLER,
      ENUM_USER_ROLE.STUDENT,
    ),
    FileUploadHelper.upload.single('image'),
    FileUploadeController.uploadeProfileFileByServer,
  );

router
  .route('/upload-multiple-images')
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SELLER,
      ENUM_USER_ROLE.STUDENT,
    ),
    FileUploadHelper.multipleFileUpload.array('images', 10),
    FileUploadeController.uploadeMultipalFileByServer,
  );

router
  .route('/upload-video')
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    uploadVideoFile,
    FileUploadeController.uploadeSingleFileByServer,
  );

router
  .route('/upload-pdf')
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      // ENUM_USER_ROLE.SELLER,
      // ENUM_USER_ROLE.STUDENT,
    ),
    uploadPdfFile,
    FileUploadeController.uploadePdfFileByServer,
  );
router
  .route('/upload-audio')
  .post(
    // authMiddleware(
    //   ENUM_USER_ROLE.ADMIN,
    //   ENUM_USER_ROLE.SELLER,
    //   ENUM_USER_ROLE.STUDENT,
    // ),
    uploadAudioFile,
    FileUploadeController.uploadeAudioFileByServer,
  );
// router.route('/uploade-multipal-videos').post(
//   uploadMultipleImage, FileUploadeController.uploadeSingleFileByServer);

router
  .route('/')
  .get(
    // authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    FileUploadeController.getAllFileUploade,
  )
  .post(
    // authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(FileUploadeValidation.createFileUploadezodSchema),
    FileUploadeController.createFileUploade,
  );

router
  .route('/:id')
  .get(
    // authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    FileUploadeController.getSingleFileUploade,
  )
  .put(
    // authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(FileUploadeValidation.updateFileUploadezodSchema),
    FileUploadeController.updateFileUploade,
  )
  .delete(FileUploadeController.deleteFileUploade);

export const FileUploadeRoute = router;
