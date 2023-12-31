import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { ILesson, LessonModel } from './lesson.interface';

const lessonSchema = new Schema<ILesson,LessonModel>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    img: {
      type: String,
    },
    
    details: {
      type: String,
      trim: true,
    },
    short_details: {
      type: String,
      trim: true,
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
    video: {
      type: String,
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

export const Lesson = model<ILesson,LessonModel>('Lesson', lessonSchema);
