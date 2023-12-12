import { Model, Types } from 'mongoose';
import { IFileUploade } from '../fileUploade/interface.fileUploade';
import { IUser } from '../users/users.interface';

export type ICourseFilters = {
  searchTerm?: string;
  price?: number;
  date?: string;
  type?: string;
  status?: string;
  course_mode?: string;
  'categoryDetails.category'?: string;
  'reviews.star'?: number;
  select?: string;
  publisher?: string;
};

// export type ICourseSearchableField = {
//   title: string;
//   publisherName: string;
//   header_1: string;
//   header_2: string;
//   description: string;
//   courseId: string;
// };

export type IPublish = {
  status: 'active' | 'deactive' | 'save';
  date: string;
};

export type ICourse = {
  courseId: string;
  title: string;
  price?: number;
  type: 'free' | 'paid' | 'open' | 'closed' | 'recurrig';
  // course_mode: 'pre_recorded' | 'jobs' | 'events' 
  course_mode?: string 
  category: string;
  discount?: {
    value: number;
    startDate?: string;
    expiryDate?: string;
  };
  vat?: number;
  header_1?: string;
  header_2?: string;
  description?: string;
  thumbnail?: string | IFileUploade;
  images_album: Array<string | IFileUploade>;
  categoryDetails?: {
    category?: string; //_id
    title?: string; //category name
  };
  publish?: IPublish;
  publisher: Types.ObjectId | IUser;
  publisherName: string;
  status?: 'active' | 'deactive' | 'save';
  tag?: string[];
  reviews?: {
    userId: Types.ObjectId;
    star: number;
    message?: string;
  }[];
};

export type CourseModel = Model<ICourse, Record<string, unknown>>;
