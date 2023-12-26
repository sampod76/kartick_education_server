import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

import { IModule } from '../module/module.interface';
import { ILesson } from '../lesson/lesson.interface';

export type IQuizFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  module?: string;
  lesson?: string;
  delete?: "yes" | "no" ;
  // other query parameters
};

export type IQuizSearchableField = {
  title?: string;
  details?: string;
};

export type IQuiz = {
  title: string;
  img?: string;
  details?: string;
  passingGrade?: number;
  minus_skip?: boolean;
  //
  lesson?: Types.ObjectId | ILesson;
  author?: Types.ObjectId | IUser;
  module: Types.ObjectId | IModule ;
  status: 'active' | 'deactivate' | 'save';
  demo_video?: Record<string, string>;
  tags?: string[];
};

export type QuizModel = Model<IQuiz, Record<string, unknown>>;
