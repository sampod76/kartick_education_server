import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

import { IModule } from '../module/module.interface';
import { IQuiz } from '../singel_quiz/quiz.interface';

export type ISingleQuizFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  module?: string;
  delete?: 'yes' | 'no';
  // other query parameters
};

export type ISingleQuizSearchableField = {
  title?: string;
  details?: string;
};

export type ISingleQuiz = {
  title: string;
  img?: string;
  details?: string;
  hints?: string;
  serialNumber?: number;
  time_duration?: number; // milliseconds
  answers: Array<{
    title: string;
    serialNumber?: number;
    correct?: boolean;
    img?: string;
    status: 'active' | 'deactivate' | 'save';
  }>;
  //
  quiz: Types.ObjectId | IQuiz;
  author?: Types.ObjectId | IUser;
  module: Types.ObjectId | IModule;
  status: 'active' | 'deactivate' | 'save';
  demo_video?: Record<string, string>;
  tags?: string[];
};

export type SingleQuizModel = Model<ISingleQuiz, Record<string, unknown>>;