import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { IQuiz, QuizModel } from './quiz.interface';

const quizSchema = new Schema<IQuiz, QuizModel>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    imgs: [{
      type: String,
    }],
    details: {
      type: String,
      trim: true,
    },
    short_description: {
      type: String,
      trim: true,
    },
    serial_number: {
      type: Number,
      min: 0,
    },
    passingGrade: {
      type: Number,
      min: 0,
    },
    minus_skip: {
      type: Boolean,
      default: false,
    },
    author: {
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
    demo_video: {
      type: Object,
      default: {},
    },
    tags: [String],
    isDelete: { type: String, default: 'no' },
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  }
);

export const Quiz = model<IQuiz, QuizModel>('Quiz', quizSchema);

