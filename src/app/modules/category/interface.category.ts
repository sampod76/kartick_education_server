import { Model } from 'mongoose';
import { IStatus } from '../../interface/globalTypes';

export type ICategoryFilters = {
  searchTerm?: string;
  title?: string;
  status?: IStatus;
  delete?: 'yes' | 'no';
};

export type ICategory = {
  title: string;
  img?: string;
  status: IStatus;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
