import { Model, Types } from 'mongoose';

import { ICategory } from '../category/interface.category';
import { IPackage } from '../package/package.interface';
import { IUser } from '../user/user.interface';

export type IPurchasePackageFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  package?: string;
  membershipUid?: string;
  type?: string;
  //
  delete?: 'yes' | 'no';
  // other query parameters
  isDelete?: string;
};

export type IPurchasePackageSearchableField = {
  title?: string;
};

export type IPurchasePackage = {
  //
  package: Types.ObjectId | IPackage | string;
  expiry_date: string;
  total_purchase_student: number;
  remaining_purchase_student: number;
  students: string[];
  user: Types.ObjectId | IUser | string;
  //
  membership: { title: string; uid?: string };
  title: string;
  date_range: string[];
  categories: {
    category: Types.ObjectId | ICategory | string;
    label?: string;
    //
    biannual?: {
      price: number;
      each_student_increment?: number;
    };
    monthly?: {
      price: number;
      each_student_increment?: number;
    };
    yearly?: {
      price: number;
      each_student_increment?: number;
    };
    //
  }[];

  //
  type: 'bundle' | 'select' | 'multiple_select';
  status: 'active' | 'deactivate' | 'save';
  //
  purchase_time: {
    biannual?: {
      price: number;
      each_student_increment: number;
    };
    monthly?: {
      price: number;
      each_student_increment: number;
    };
    yearly?: {
      price: number;
      each_student_increment: number;
    };
  };

  isDelete: string;
};

export type PurchasePackageModel = Model<
  IPurchasePackage,
  Record<string, unknown>
>;
