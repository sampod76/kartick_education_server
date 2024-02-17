import { Model, Schema } from 'mongoose';
import { IStatus } from '../../interface/globalTypes';
import { ICategory } from '../category/interface.category';

export type ICourse_labelFilters = {
  searchTerm?: string;
  title?: string;
  status?: IStatus;
  serial_number?: number;
  delete?: 'yes' | 'no';
  children?: string;
  category?: string;
  isDelete?: string;
};

export type ICourse_label = {
  title: string;
  img?: string;
  status: IStatus;
  serial_number?:number;
  category:string | ICategory |Schema.Types.ObjectId;
  isDelete: string;
};

export type Course_labelModel = Model<ICourse_label, Record<string, unknown>>;
