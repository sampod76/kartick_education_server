import { Schema, model } from 'mongoose';
import {
  IPurchaseCourse,
  PurchaseCourseModel,
} from './purchase_courses.interface';
const PurchaseCourseSchema = new Schema<IPurchaseCourse, PurchaseCourseModel>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    expiry_date: String,
    //------------ for  PendingPurchaseCourse  ------------
    payment: {
      transactionId: String,
      platform: String,
      record: { type: Schema.Types.ObjectId, ref: 'PendingPurchaseCourse' },
    },
    paymentStatus: {
      type: String, // approved, pending,rejected,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
    },
    total_price:Number,
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

export const PurchaseCourse = model<IPurchaseCourse, PurchaseCourseModel>(
  'PurchaseCourse',
  PurchaseCourseSchema,
);

export const PendingPurchaseCourse = model<
  IPurchaseCourse,
  PurchaseCourseModel
>('PendingPurchaseCourse', PurchaseCourseSchema);
