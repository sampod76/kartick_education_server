import express from 'express';
import { ShopController } from './shop.controller';

import validateRequestZod from '../../middlewares/validateRequestZod';
import { ShopValidation } from './shop.validation';

const router = express.Router();

router.post(
  '/create-shop',
  validateRequestZod(ShopValidation.shopZodSchema),
  ShopController.createShop,
);
router.get('/', ShopController.getShops);
router.get('/:id', ShopController.getSingleShop);
router.patch(
  '/:id',
  validateRequestZod(ShopValidation.updateShopZodSchema),
  ShopController.updateShop,
);
router.delete('/:id', ShopController.deleteShop);

export const shopRoutes = router;
