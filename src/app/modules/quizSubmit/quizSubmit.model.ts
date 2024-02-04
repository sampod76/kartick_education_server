import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { IQuizSubmit, QuizSubmitModel } from './quizSubmit.interface';

const quizSubmitSchema = new Schema<IQuizSubmit, QuizSubmitModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    //
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    milestone: {
      type: Schema.Types.ObjectId,
      ref: 'Milestone',
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    //
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    isDelete: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },
    singleQuiz: { type: Schema.Types.ObjectId, ref: 'SingleQuiz' },
    submitAnswers: [String],
    singleAnswer: String,
    // userSubmitQuizzes: [
    //   {
    //     singleQuizId: { type: String, ref: 'SingleQuiz' },
    //     submitAnswers: [String],
    //   },
    // ],
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  },
);

export const QuizSubmit = model<IQuizSubmit, QuizSubmitModel>(
  'QuizSubmit',
  quizSubmitSchema,
);
