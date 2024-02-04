import { Model, Types } from 'mongoose';
// import { IFileUploade } from '../fileUploade/interface.fileUploade';
// import { IUser } from '../users/users.interface';

export type ICourseFilters = {
  searchTerm?: string;
  price?: number;
  duration?: string;
  level?: string;
  status?: string;
  price_type?: string;
  category?: string;
  select?: string;
  delete?: 'yes' | 'no';
  isDelete?: string;
  // other query parameters
};

export type ICourseSearchableField = {
  title?: string;
  short_description?: string;
  favorite?: string;
};

export type ICourse = {
  title: string;
  img: string;
  snid: string;
  details?: string;
  short_description?: string;
  author: Types.ObjectId;
  category: Types.ObjectId;
  // sub1_course_category_id: Types.ObjectId;
  price: number;
  tax?: number;
  vat?: number;
  duration?: string[];
  level?: string;
  price_type: 'free' | 'paid' | 'closed' | 'recurring';
  status: 'active' | 'deactivate' | 'save' | 'disable';
  showing_number?: number;
  favorite: 'yes' | 'no';
  demo_video?: Record<string, string>;
  tags?: string[];
  isDelete: string;
};

// export type CourseModel = Model<ICourse, Record<string, unknown>>;
export type CourseModel = {
  isCourseExistMethod({
    id,
    title,
  }: {
    id?: string;
    title?: string;
  }): Promise<Pick<ICourse, 'title'>>;
} & Model<ICourse>;
