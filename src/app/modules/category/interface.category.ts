import { Model } from 'mongoose';
import { IStatus } from '../../interface/globalTypes';

export type ICategoryFilters = {
  searchTerm?: string;
  title?: string;
  status?: IStatus;
  delete?: 'yes' | 'no';
  children?: string;
  isDelete?: string;
};

export type ICategory = {
  title: string;
  img?: string;
  status: IStatus;
  isDelete: string;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
