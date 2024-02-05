import { Model, Types } from 'mongoose';
import { ICourse } from '../course/course.interface';
// import { IFileUploade } from '../fileUploade/interface.fileUploade';
// import { IUser } from '../users/users.interface';

export type IShow_advance_classesFilters = {
  searchTerm?: string;
  title?: string;

  status?: string;
  page?: string;
  select?: string;
  delete?: 'yes' | 'no';
  isDelete?: string;
  // other query parameters
};

export type IShow_advance_classesSearchableField = {
  title?: string;
};

export type IShow_advance_classes = {
  title: string;
  buttonLink?: string;
  classes: [
    {
      title: string;
      img: string;
      short_description: string;
      buttonLink?: string;
      course?: string | Types.ObjectId | ICourse;
    },
  ];
  page?: string;
  details?: string;
  short_description?: string;
  author: Types.ObjectId;
  // sub1_Show_advance_classes_category_id: Types.ObjectId;
  status: 'active' | 'deactivate' | 'save' | 'disable';
  demo_video?: Record<string, string>;
  tags?: string[];
  isDelete: string;
};

// export type Show_advance_classesModel = Model<IShow_advance_classes, Record<string, unknown>>;
export type Show_advance_classesModel = {
  isShow_advance_classesExistMethod({
    id,
    title,
  }: {
    id?: string;
    title?: string;
  }): Promise<Pick<IShow_advance_classes, 'title'>>;
} & Model<IShow_advance_classes>;
