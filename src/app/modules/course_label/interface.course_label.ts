import { Model } from 'mongoose';
import { IStatus } from '../../interface/globalTypes';

export type ICourse_labelFilters = {
  searchTerm?: string;
  title?: string;
  status?: IStatus;
  serial_number?: number;
  delete?: 'yes' | 'no';
  children?: string;
  isDelete?: string;
};

export type ICourse_label = {
  title: string;
  img?: string;
  status: IStatus;
  serial_number?:number;
  isDelete: string;
};

export type Course_labelModel = Model<ICourse_label, Record<string, unknown>>;
