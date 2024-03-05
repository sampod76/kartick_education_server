import { Model, Types } from 'mongoose';

export type ISurpriseBag = {
  shopId: Types.ObjectId | string;
  shop_categoryId?: Types.ObjectId | string | undefined;
  userId: Types.ObjectId | string;
  name: string;
  bagNo: string;
  validation: string;
  pickUpHour: string;
  pricing: string;
  deliveryCharge: string;
  description: string;
  foodCategory: string;
  orderStatus: string;
  qrCode: string;
};

export type ISurpriseBagModel = Model<ISurpriseBag, Record<string, unknown>>;
