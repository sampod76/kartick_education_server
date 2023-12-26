import { Schema, model } from 'mongoose';
import { STATUS_ARRAY, YN_ARRAY } from '../../../constant/globalConstant';
import { IMilestone, MilestoneModel } from './milestone.interface';

const milestoneSchema = new Schema<IMilestone,MilestoneModel>(
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
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
    },
    showing_number: {
      type: Number,
      default: 9999,
    },
    demo_video: {
      type: Object,
      default: {},
    },
    favorite: {
      type: String,
      enum: YN_ARRAY,
      default: 'no',
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

export const Milestone = model<IMilestone,MilestoneModel>('Milestone', milestoneSchema);
