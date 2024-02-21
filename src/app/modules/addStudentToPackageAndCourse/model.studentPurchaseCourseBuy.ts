import { Schema, model } from 'mongoose';
import {
  IStudentPurchasePackageCategoryCourse,
  StudentPurchasePackageCategoryCourseModel,
} from './interface.studentPurchaseCourseBuy';

const StudentPurchasePackageCategoryCourseSchema = new Schema<
  IStudentPurchasePackageCategoryCourse,
  StudentPurchasePackageCategoryCourseModel
>(
  {
    // for -
    purchaseCourse: {
      type: Schema.Types.ObjectId,
      ref: 'PurchaseCourse',
    },
    // when seller by single category then add
    purchaseCategory: {
      type: Schema.Types.ObjectId,
      ref: 'PurchaseCategory',
    },
    //
    sellerPackage: {
      type: Schema.Types.ObjectId,
      ref: 'PurchasePackage',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    author: {
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

export const StudentPurchasePackageCategoryCourse = model<
  IStudentPurchasePackageCategoryCourse,
  StudentPurchasePackageCategoryCourseModel
>(
  'StudentPurchasePackageCategoryCourse',
  StudentPurchasePackageCategoryCourseSchema,
);
