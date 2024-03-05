import { Schema, model } from 'mongoose';
import { IShop, IShopModel } from './shop.interface';

const shopSchema = new Schema<IShop>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    weekend: {
      type: String,
      required: true,
    },
    images: {
      url1: {
        type: String,
        required: true,
      },
      url2: {
        type: String,
      },
      url3: {
        type: String,
      },
    },
    address: {
      type: String,
      required: true,
    },
    locationLink: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtual: true },
  },
);

export const Shop = model<IShop, IShopModel>('Shop', shopSchema);
