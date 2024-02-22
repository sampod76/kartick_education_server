import { Model, Types } from 'mongoose';

import { ICategory } from '../category/interface.category';
import { IUser } from '../user/user.interface';

export type IPurchase_categoryFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  category?: string;
  user?: string;
  //
  delete?: 'yes' | 'no';
  // other query parameters
  isDelete?: string;
};

export type IPurchase_categorySearchableField = {
  title?: string;
};

export type IPurchase_category = {
  //
  category: Types.ObjectId | ICategory | string;
  expiry_date: string;
  total_price: number;
  user: Types.ObjectId | IUser | string;
  //
  payment: {
    transactionId?: string;
    platform?: string;
    //IPurchasePackage as a same IPaddingPurchase_category
    record?: Types.ObjectId | IPurchase_category | string;
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

export type Purchase_categoryModel = Model<
  IPurchase_category,
  Record<string, unknown>
>;
