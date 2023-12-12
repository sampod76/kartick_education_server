import { Model } from 'mongoose';
import { IFileUploade } from '../fileUploade/interface.fileUploade';

export type ICategoryFilters = {
  searchTerm?: string;
  title?: string;
  status?: string;
};

export type ICategory = {
  title: string;
  thumbnail?: string | IFileUploade;
  status?: string;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
