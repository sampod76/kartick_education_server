import { Schema, model } from 'mongoose';
import { GENDER_ARRAY } from '../../../constant/globalConstant';
import { ISeller, SellerModel } from './seller.interface';

const SellerSchema = new Schema<ISeller, SellerModel>(
  {
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
        },
      },
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: GENDER_ARRAY,
    },
    email: {
      type: String,
      //unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      //unique: true,
      required: true,
    },
    address: {
      type: String,
    },
    user_bio: {
      type: String,
    },
    img: {
      type: String,
    },
    details: {
      type: String,
    },
    isDelete: {
      type: String,
      default: 'yes',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Seller = model<ISeller, SellerModel>('Seller', SellerSchema);
