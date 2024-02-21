import { Schema, model } from 'mongoose';
import {
  IPurchase_category,
  Purchase_categoryModel,
} from './purchase_category.interface';
const Purchase_categorySchema = new Schema<
  IPurchase_category,
  Purchase_categoryModel
>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    expiry_date: String,
    //------------ for  PendingPurchase_category  ------------
    payment: {
      transactionId: String,
      platform: String,
      record: { type: Schema.Types.ObjectId, ref: 'PendingPurchase_category' },
    },
    paymentStatus: {
      type: String, // approved, pending,rejected,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
    },
    total_price: Number,
    //------------end --------------------------------------
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['active', 'deactivate', 'save'],
      default: 'active',
    },
    isDelete: { type: String, default: 'no' },
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  },
);

export const Purchase_category = model<
  IPurchase_category,
  Purchase_categoryModel
>('Purchase_category', Purchase_categorySchema);

export const PendingPurchase_category = model<
  IPurchase_category,
  Purchase_categoryModel
>('PendingPurchase_category', Purchase_categorySchema);
