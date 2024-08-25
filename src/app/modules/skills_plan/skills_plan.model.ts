import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { ISkills_plan, Skills_planModel } from './skills_plan.interface';

const Skills_planSchema = new Schema<ISkills_plan, Skills_planModel>(
  {
    title: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },

    imgs: [
      {
        type: String,
      },
    ],
    points: [
      {
        title: String,
        
      },
    ],
    imgTitle: {
      type: String,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
    page: {
      type: String,
      trim: true,
      default:"home"
    },
    short_description: {
      type: String,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
    },
    isDelete: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
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
  },
);
Skills_planSchema.statics.isSkills_planExistMethod = async function ({
  id,
  title,
}: {
  id?: string;
  title?: string;
}): Promise<Pick<ISkills_plan, 'title'> | null> {
  let result = null;
  if (id) {
    result = await Skills_plan.findById(id);
  }
  if (title) {
    result = await Skills_plan.findOne(
      { title: new RegExp(title, 'i') },
      { title: 1 },
    );
  }

  return result;
};

export const Skills_plan = model<ISkills_plan, Skills_planModel>(
  'Skills_plan',
  Skills_planSchema,
);
