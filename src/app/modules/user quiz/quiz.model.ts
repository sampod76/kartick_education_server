import { Schema, Types, model } from 'mongoose';
import { IQuiz, QuizModel } from './quiz.interface';

const QuizSchema = new Schema<IQuiz, QuizModel>(
  {
    // quizId: {
    //   type: String,
    // },
    quizList: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        serial_no: Number,
        answers: {
          type: [String],
          required: true,
        },
        correct_answer: {
          type: String,
          require: true,
        },
        tag: {
          type: [String],
        },
        hint: {
          type: String,
          trim: true,
        },

        // optional
        header_1: {
          type: String,
          trim: true,
        },
        header_2: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        thumbnail: {
          type: String,
          trim: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'deactive'],
      default: 'active',
    },
    course: {
      type: Types.ObjectId,
      ref: 'Course',
    },
    courseId: {
      type: String,
    },
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  }
);

export const Quiz = model<IQuiz, QuizModel>('Quiz', QuizSchema);
