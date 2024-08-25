import { Model, Types } from 'mongoose';
// import { IFileUploade } from '../fileUploade/interface.fileUploade';
// import { IUser } from '../users/users.interface';

export type IShort_overviewFilters = {
  searchTerm?: string;
  title?: string;

  status?: string;
  page?: string;
  select?: string;
  delete?: 'yes' | 'no';
  isDelete?: string;
  // other query parameters
};

export type IShort_overviewSearchableField = {
  title?: string;
};

export type IShort_overview = {
  title: string;
  page?: string;
  cards: [{ title: string; countNumber: string; short_description: string }];
  details?: string;
  short_description?: string;
  author: Types.ObjectId;
  // sub1_Short_overview_category_id: Types.ObjectId;
  status: 'active' | 'deactivate' | 'save' | 'disable';
  demo_video?: Record<string, string>;
  tags?: string[];
  isDelete: string;
};

// export type Short_overviewModel = Model<IShort_overview, Record<string, unknown>>;
export type Short_overviewModel = {
  isShort_overviewExistMethod({
    id,
    title,
  }: {
    id?: string;
    title?: string;
  }): Promise<Pick<IShort_overview, 'title'>>;
} & Model<IShort_overview>;
