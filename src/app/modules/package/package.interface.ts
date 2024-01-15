import { Model, Types } from 'mongoose';

import { ICategory } from '../category/interface.category';

export type IPackageFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;

  membershipUid?: string;
  type?: string;
  //
  delete?: 'yes' | 'no';
  // other query parameters

  isDelete?: string;
};

export type IPackageSearchableField = {
  title?: string;
};

export type IPackage = {
  membership: { title: string; uid?: string };
  title: string;
  img?: string;
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
  }[];
  date_range?: string[];
  type: 'bundle' | 'select' | 'multiple_select';
  //
  status: 'active' | 'deactivate' | 'save';
  //
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
  isDelete: string;
};

export type PackageModel = Model<IPackage, Record<string, unknown>>;
