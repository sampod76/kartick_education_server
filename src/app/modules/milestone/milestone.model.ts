import { Schema, model } from 'mongoose';
import { STATUS_ARRAY, YN_ARRAY } from '../../../constant/globalConstant';
import { IMilestone, MilestoneModel } from './milestone.interface';

const milestoneSchema = new Schema<IMilestone, MilestoneModel>(
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
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
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
    milestone_number: {
      type: Number,
      // unique: true,
      required: [true, 'milestone_number is required'],
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

export const Milestone = model<IMilestone, MilestoneModel>(
  'Milestone',
  milestoneSchema
);
