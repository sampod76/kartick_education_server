import { Schema, model } from 'mongoose';
import { PURCHASE_PACKAGE_TYPES_ARRAY } from './purchase_package.constant';
import {
  IPurchasePackage,
  PurchasePackageModel,
} from './purchase_package.interface';

const PurchasePackageSchema = new Schema<
  IPurchasePackage,
  PurchasePackageModel
>(
  {
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
    },
    membership: {
      title: String,
      uid: String,
    },
    title: String,
    date_range: [String],
    categories: [
      {
        category: { type: Schema.Types.ObjectId, ref: 'Category' }, // Assuming 'Category' is the name of your category model
        label: String,
        biannual: {
          price: Number,
          each_student_increment: Number,
        },
        monthly: {
          price: Number,
          each_student_increment: Number,
        },
        yearly: {
          price: Number,
          each_student_increment: Number,
        },
      },
    ],
    //
    expiry_date: String,
    total_purchase_student: Number,
    remaining_purchase_student: Number,
    students: [String],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    //
    type: {
      type: String,
      enum: PURCHASE_PACKAGE_TYPES_ARRAY,
    },
    biannual: {
      price: Number,
      each_student_increment: Number,
    },
    monthly: {
      price: Number,
      each_student_increment: Number,
    },
    yearly: {
      price: Number,
      each_student_increment: Number,
    },
    status: {
      type: String,
      enum: ['active', 'deactivate', 'save'],
    },
    isDelete: { type: String, default: 'no' },
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  }
);

export const PurchasePackage = model<IPurchasePackage, PurchasePackageModel>(
  'PurchasePackage',
  PurchasePackageSchema
);
