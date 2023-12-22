import { Model } from 'mongoose';


export type ICategoryFilters = {
  searchTerm?: string;
  title?: string;
  status?: string;
  delete?: "yes" | "no" ;
};

export type ICategory = {
  title: string;
  img?: string; 
  status: 'active' | 'deactivate' | 'save' | 'disable';
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
