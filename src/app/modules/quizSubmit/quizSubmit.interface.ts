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
  isCorrect?: 'yes' | 'no';
  isDelete?: string;
  // other query parameters
  quiz?: string;
  singleQuiz?: string;
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
  user: Types.ObjectId | IUser | string;
  quiz: Types.ObjectId | IQuiz | string;
  singleQuiz: Types.ObjectId | IQuiz | string;
  status: 'active' | 'deactivate' | 'save';
  isDelete: string;
  isCorrect: 'yes' | 'no';
  //
  // userSubmitQuizzes: IProvideUserQuiz[];
  // userSubmitQuiz: IProvideUserQuiz;
  submitAnswers?: string[];
  singleAnswer?: string;
};

export type QuizSubmitModel = Model<IQuizSubmit, Record<string, unknown>>;
