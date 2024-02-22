import { Model, Types } from 'mongoose';

import { IPackage } from '../package/package.interface';
import { IPurchaseCourse } from '../purchase_courses/purchase_courses.interface';
import { IUser } from '../user/user.interface';
import { IPurchase_category } from '../purchase_category/purchase_category.interface';

export type IStudentPurchasePackageCategoryCourseFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  sellerPackage?: string;
  user?: string;
  //
  delete?: 'yes' | 'no';
  isDelete?: string;
};

export type IStudentPurchasePackageCategoryCourseSearchableField = {
  title?: string;
};

export type IStudentPurchasePackageCategoryCourse = {
  purchaseCourse: Types.ObjectId | IPurchaseCourse | string;
  // when seller by single category then add
  purchaseCategory: Types.ObjectId | IPurchase_category | string;
  sellerPackage: Types.ObjectId | IPackage | string;
  user: Types.ObjectId | IUser | string;
  author: Types.ObjectId | IUser | string;
  status: 'active' | 'deactivate' | 'save';
  isDelete: string;
};

export type StudentPurchasePackageCategoryCourseModel = Model<
  IStudentPurchasePackageCategoryCourse,
  Record<string, unknown>
>;
