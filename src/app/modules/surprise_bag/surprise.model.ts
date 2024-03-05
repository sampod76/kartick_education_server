import { Schema, model } from 'mongoose';
import { ISurpriseBag, ISurpriseBagModel } from './surprise.interface';
import { ENUM_FC } from '../../../enums/globalEnums';

const surpriseBagSchema = new Schema<ISurpriseBag>({
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
  shop_categoryId: { type: Schema.Types.ObjectId, ref: 'Shop' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  bagNo: { type: String, required: true },
  validation: { type: String, required: true },
  pickUpHour: { type: String, required: true },
  pricing: { type: String, required: true },
  deliveryCharge: { type: String, required: true },
  description: { type: String, required: true },
  foodCategory: { type: String, enum: ENUM_FC, required: true },
  orderStatus: { type: String, required: true },
  qrCode: { type: String, required: true },
});

export const SurpriseBag = model<ISurpriseBag, ISurpriseBagModel>(
  'SurpriseBag',
  surpriseBagSchema,
);
