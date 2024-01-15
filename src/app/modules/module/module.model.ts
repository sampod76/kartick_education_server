import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { IModule, ModuleModel } from './module.interface';

const moduleSchema = new Schema<IModule,ModuleModel>(
  {
    title: {
      type: String,
      trim: true,
   
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
    //
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    milestone: {
      type: Schema.Types.ObjectId,
      ref: 'Milestone',
    },
    //
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
    },
isDelete: {
      type: String,
      enum:["yes", "no"],
      default: 'yes',
    },
    module_number: {
      type: Number,
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

export const Module = model<IModule,ModuleModel>('Module', moduleSchema);
