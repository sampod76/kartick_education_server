import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

import { ICategory } from '../category/interface.category';
import { ICourse } from '../course/course.interface';
import { ILesson } from '../lesson/lesson.interface';
import { IMilestone } from '../milestone/milestone.interface';
import { IModule } from '../module/module.interface';
import { IQuiz } from '../quiz/quiz.interface';

export type IQUIZ_TYPE = 'input' | 'select' | 'multiple_select' | 'text';

export type ISingleQuizFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  category?: string;
  course?: string;
  milestone?: string;
  module?: string;
  lesson?: string;
  quiz?: string;
  delete?: 'yes' | 'no';
  // other query parameters
};

export type ISingleQuizSearchableField = {
  title?: string;
  details?: string;
};

export type ISingleQuiz = {
  title: string;
  imgs?: string[];
  details?: string;
  short_description?: string;
  hints?: string;
  serialNumber?: number;
  time_duration?: number; // milliseconds
  answers?: Array<{
    title: string;
    serialNumber?: number;
    correct?: boolean;
    imgs?: Array<string>;
    status: 'active' | 'deactivate' | 'save';
  }>;
  single_answer?: string;
  type: IQUIZ_TYPE;
  //
  author?: Types.ObjectId | IUser;
  //
  category: Types.ObjectId | ICategory | string;
  course: Types.ObjectId | ICourse | string;
  milestone: Types.ObjectId | IMilestone | string;
  module: Types.ObjectId | IModule | string;
  lesson?: Types.ObjectId | ILesson;
  quiz: Types.ObjectId | IQuiz;
  //
  status: 'active' | 'deactivate' | 'save';
  demo_video?: Record<string, string>;
  tags?: string[];
};

export type SingleQuizModel = Model<ISingleQuiz, Record<string, unknown>>;
