import express from 'express';
import { SurpriseBagController } from './surprise.controller';

import { SurpriseValidation } from './surprise.validation';
import validateRequestZod from '../../middlewares/validateRequestZod';

const router = express.Router();

router.post(
  '/create-surprise',
  validateRequestZod(SurpriseValidation.surpriseZodSchema),
  SurpriseBagController.createSurprise,
);
router.get('/', SurpriseBagController.getAllSurprise);

router
  .route('/:id')
  .get(SurpriseBagController.getSingleSurprise)
  .patch(SurpriseBagController.updateSurpriseBag)
  .delete(SurpriseBagController.deleteSurpriseBag);

export const surpriseBagRoutes = router;
