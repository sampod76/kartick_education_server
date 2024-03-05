import httpStatus from 'http-status';
import { IShop } from './shop.interface';
import { Shop } from './shop.model';
import ApiError from '../../errors/ApiError';

const createShopToDB = async (shop: IShop): Promise<IShop | null> => {
  const createShop = await Shop.create(shop);
  if (!createShop) {
    throw new ApiError(httpStatus.FAILED_DEPENDENCY, 'Failed to create shop');
  }
  return createShop;
};

const getShopsFromDB = async (): Promise<IShop[] | null> => {
  const shops = await Shop.find({});
  if (!shops) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No shops found');
  }
  return shops;
};

const updateShopFromDB = async (
  id: string,
  shop: IShop,
): Promise<IShop | null> => {
  const updateShop = await Shop.findByIdAndUpdate({ _id: id }, shop, {
    new: true,
  });
  if (!updateShop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }
  return updateShop;
};

const getSingleShopFromDB = async (id: string): Promise<IShop | null> => {
  const shop = await Shop.findById({ _id: id });
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }
  return shop;
};

const deleteShopFromDB = async (id: string): Promise<IShop | null> => {
  const shop = await Shop.findByIdAndDelete({ _id: id });
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }
  return shop;
};
export const ShopService = {
  createShopToDB,
  getShopsFromDB,
  updateShopFromDB,
  getSingleShopFromDB,
  deleteShopFromDB,
};
