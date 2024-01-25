import { Model, Types } from 'mongoose';

import { ICourse } from '../course/course.interface';
import { IUser } from '../user/user.interface';

export type IPurchaseCourseFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  course?: string;
  user?: string;
  //
  delete?: 'yes' | 'no';
  // other query parameters
  isDelete?: string;
};

export type IPurchaseCourseSearchableField = {
  title?: string;
};

export type IPurchaseCourse = {
  //
  course: Types.ObjectId | ICourse | string;
  expiry_date: string;
  total_price: number;
  user: Types.ObjectId | IUser | string;
  //
  payment: {
    transactionId?: string;
    platform?: string;
    //IPurchasePackage as a same IPaddingPurchaseCourse
    record?: Types.ObjectId | IPurchaseCourse | string;
  };
  paymentStatus?: 'approved' | 'pending' | 'rejected';
  purchase: {
    label: string; //example:biannual,monthly,yearly
    price: number;
  };
  //
  status: 'active' | 'deactivate' | 'save';
  isDelete: string;
};

export type PurchaseCourseModel = Model<
  IPurchaseCourse,
  Record<string, unknown>
>;
