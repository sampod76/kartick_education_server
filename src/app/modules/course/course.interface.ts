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
  // other query parameters
};

export type ICourseSearchableField = {
  title?: string;
  details?: string;
};

export type ICourse = {
  title: string;
  img: string;
  snid: string;
  details?: string;
  author: Types.ObjectId;
  category: Types.ObjectId;
  // sub1_course_category_id: Types.ObjectId;
  price: number;
  tax?: number;
  vat?: number;
  duration?: string;
  level?: string;
  price_type: 'free' | 'paid' | 'closed' | 'recurring';
  status: 'active' | 'deactivate' | 'save' | 'disable';
  showing_number?: number;
  favorite: 'yes' | 'no';
  demo_video?: Record<string, string>;
  tags?: string[];
};

export type CourseModel = Model<ICourse, Record<string, unknown>>;
