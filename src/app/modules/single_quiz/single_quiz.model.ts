import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { SINGLE_QUIZ_TYPE } from './single_quiz.constant';
import { ISingleQuiz, SingleQuizModel } from './single_quiz.interface';

const singleQuizSchema = new Schema<ISingleQuiz, SingleQuizModel>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    answers: [
      {
        title: {
          type: String,
          trim: true,
        },
        correct: {
          type: Boolean,
          default: false,
        },
        img: {
          type: String,
          trim: true,
        },
        serialNumber: {
          type: Number,
          default: 0,
        },
        status: {
          type: String,
          enum: STATUS_ARRAY,
          default: 'active',
        },
      },
    ],
    imgs: [
      {
        type: String,
        trim: true,
      },
    ],
    details: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: SINGLE_QUIZ_TYPE,
      default: 'select',
    },
    serialNumber: {
      type: Number,
      min: 0,
    },
    time_duration: {
      type: Number,
      min: 0,
    },

    hints: {
      type: String,
      trim: true,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      
    },

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
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  }
);

export const SingleQuiz = model<ISingleQuiz, SingleQuizModel>(
  'SingleQuiz',
  singleQuizSchema
);
