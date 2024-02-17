import { Model } from 'mongoose';
import { IStatus } from '../../interface/globalTypes';

export type ICategoryFilters = {
  searchTerm?: string;
  title?: string;
  status?: IStatus;
  serial_number?: number;
  delete?: 'yes' | 'no';
  children?: string;
  isDelete?: string;
  sampod?:boolean
};

export type ICategory = {
  title: string;
  img?: string;
  status: IStatus;
  serial_number?:number;
  isDelete: string;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
