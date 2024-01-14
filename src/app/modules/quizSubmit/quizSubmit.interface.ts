import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

import { ICategory } from '../category/interface.category';
import { ICourse } from '../course/course.interface';
import { ILesson } from '../lesson/lesson.interface';
import { IMilestone } from '../milestone/milestone.interface';
import { IModule } from '../module/module.interface';
import { IQuiz } from '../quiz/quiz.interface';
import { ISingleQuiz } from '../single_quiz/single_quiz.interface';

export type IQuizSubmitFilters = {
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
  // other query parameters
  quiz?: string;
  user?: string;
};

export type IQuizSubmitSearchableField = {
  title?: string;
};

export type IProvideUserQuiz = {
  singleQuizId: Types.ObjectId | ISingleQuiz | string;
  submitAnswers: Array<Types.ObjectId | ISingleQuiz | string>;
};

export type IQuizSubmit = {
  //optional
  category: Types.ObjectId | ICategory | string;
  course: Types.ObjectId | ICourse | string;
  milestone: Types.ObjectId | IMilestone | string;
  module: Types.ObjectId | IModule | string;
  lesson?: Types.ObjectId | ILesson | string;
  //
  quiz: Types.ObjectId | IQuiz | string;
  user: Types.ObjectId | IUser | string;
  status: 'active' | 'deactivate' | 'save';
  //
  userSubmitQuizzes: IProvideUserQuiz[];
  userSubmitQuiz: IProvideUserQuiz;
};

export type QuizSubmitModel = Model<IQuizSubmit, Record<string, unknown>>;