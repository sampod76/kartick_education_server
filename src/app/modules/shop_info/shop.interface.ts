import { Model, Types } from 'mongoose';

export type IShop = {
  userId: Types.ObjectId | string;
  name: string;
  category: string;
  weekend: string;
  images: {
    url1: string;
    url2?: string;
    url3?: string;
  };
  address: string;
  locationLink: string;
  about: string;
  serialNumber: string;
};

export type IShopModel = Model<IShop, Record<string, unknown>>;
