import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

import { ICategory } from '../category/interface.category';
import { ICourse } from '../course/course.interface';
import { ILesson } from '../lesson/lesson.interface';
import { IMilestone } from '../milestone/milestone.interface';
import { IModule } from '../module/module.interface';

export type IQuizFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  //
  category?: string;
  course?: string;
  milestone?: string;
  module?: string;
  lesson?: string;
 //
  delete?: 'yes' | 'no';
  isDelete?: string;
  // other query parameters
};

export type IQuizSearchableField = {
  title?: string;
  details?: string;
};

export type IQuiz = {
  title: string;
  imgs?: string[];
  short_description?: string;
  details?: string;
  serial_number?: string;
  passingGrade?: number;
  minus_skip?: boolean;
  //
  category: Types.ObjectId | ICategory | string;
  course: Types.ObjectId | ICourse | string;
  milestone: Types.ObjectId | IMilestone | string;
  module: Types.ObjectId | IModule | string;
  lesson?: Types.ObjectId | ILesson;
  //
  author?: Types.ObjectId | IUser;

  status: 'active' | 'deactivate' | 'save';
  isDelete: string;
  demo_video?: Record<string, string>;
  tags?: string[];
};

export type QuizModel = Model<IQuiz, Record<string, unknown>>;
