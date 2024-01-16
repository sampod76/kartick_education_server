import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { ILesson, LessonModel } from './lesson.interface';

const lessonSchema = new Schema<ILesson, LessonModel>(
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
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
   
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
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
    },
isDelete: {
      type: String,
      enum:["yes", "no"],
      default: 'no',
    },
    lesson_number: {
      type: Number,
    },
    lecture: {
      type: Number,
    },

    demo_video: {
      type: Object,
      default: {},
    },
    videos: [
      {
        type: Object,
        default: {},
      },
    ],
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

export const Lesson = model<ILesson, LessonModel>('Lesson', lessonSchema);
