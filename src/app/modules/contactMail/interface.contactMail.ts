import { Model, Types } from 'mongoose';
import { IStatus } from '../../interface/globalTypes';
import { IUser } from '../user/user.interface';

export type IContactMailFilters = {
  searchTerm?: string;
  email?: string;
  status?: IStatus;
  delete?: 'yes' | 'no';
  children?: string;
  user?: string;
  isDelete?: string;
};

export type IContactMail = {
  name: string;
  email: string;
  subject: string;
  user?: string | Types.ObjectId | IUser;
  message: string;
  images?: string[];
  status: IStatus;
  isDelete: string;
};

export type ContactMailModel = Model<IContactMail, Record<string, unknown>>;
