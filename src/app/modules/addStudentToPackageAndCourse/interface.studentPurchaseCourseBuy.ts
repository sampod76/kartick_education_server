import { Model, Types } from 'mongoose';

import { IPackage } from '../package/package.interface';
import { IPurchaseCourse } from '../purchase_courses/purchase_courses.interface';
import { IUser } from '../user/user.interface';

export type IStudentPurchasePackageCourseFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  sellerPackage?: string;
  user?: string;
  //
  delete?: 'yes' | 'no';
  isDelete?: string;
};

export type IStudentPurchasePackageCourseSearchableField = {
  title?: string;
};

export type IStudentPurchasePackageCourse = {
  purchaseCourse: Types.ObjectId | IPurchaseCourse | string;
  sellerPackage: Types.ObjectId | IPackage | string;
  user: Types.ObjectId | IUser | string;
  author: Types.ObjectId | IUser | string;
  status: 'active' | 'deactivate' | 'save';
  isDelete: string;
};

export type StudentPurchasePackageCourseModel = Model<
  IStudentPurchasePackageCourse,
  Record<string, unknown>
>;
