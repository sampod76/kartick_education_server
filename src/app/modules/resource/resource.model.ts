import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { IResource, ResourceModel } from './resource.interface';

const ResourceSchema = new Schema<IResource, ResourceModel>(
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
    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      required:true
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

export const Resource = model<IResource, ResourceModel>('Resource', ResourceSchema);
