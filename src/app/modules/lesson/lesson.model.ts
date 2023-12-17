import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { IModule, ModuleModel } from './lesson.interface';

const moduleSchema = new Schema<IModule,ModuleModel>(
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
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    milestone: {
      type: Schema.Types.ObjectId,
      ref: 'Milestone',
    },
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
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
