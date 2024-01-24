import { Schema, model } from 'mongoose';
import {
  IStudentPurchasePackageCourse,
  StudentPurchasePackageCourseModel,
} from './interface.studentPurchaseCourseBuy';

const StudentPurchasePackageCourseSchema = new Schema<
  IStudentPurchasePackageCourse,
  StudentPurchasePackageCourseModel
>(
  {
    // for -c
    purchaseCourse: {
      type: Schema.Types.ObjectId,
      ref: 'PurchaseCourse',
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

export const StudentPurchasePackageCourse = model<
  IStudentPurchasePackageCourse,
  StudentPurchasePackageCourseModel
>('StudentPurchasePackageCourse', StudentPurchasePackageCourseSchema);
