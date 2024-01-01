import { Model } from 'mongoose';
// import { IAdmin } from '../admin/admin.interface';
// import { IGeneralUser } from '../generalUser/interface.GeneralUser';

export type IFileUploadeFilters = {
  searchTerm?: string;
  title?: string;
  category?: string;
  tag?: string;
};

export type IFileUploade = {
  userId?: string; /* | IAdmin | IGeneralUser; */
  title?: string;
  filename: string;
  path?: string;
  size?: number;
  url?: string;
  link?: string;
  mimetype?: string;
  category?: string;
  tag?: string[];
  destination?:string
};

export type FileUploadeModel = Model<IFileUploade, Record<string, unknown>>;
