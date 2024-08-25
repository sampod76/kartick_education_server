import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import {
  IShort_overview,
  Short_overviewModel,
} from './short_overview.interface';

const Short_overviewSchema = new Schema<IShort_overview, Short_overviewModel>(
  {
    title: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },

    cards: [
      {
        title: String,
        countNumber: String,
        short_description: String,
      },
    ],

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
Short_overviewSchema.statics.isShort_overviewExistMethod = async function ({
  id,
  title,
}: {
  id?: string;
  title?: string;
}): Promise<Pick<IShort_overview, 'title'> | null> {
  let result = null;
  if (id) {
    result = await Short_overview.findById(id);
  }
  if (title) {
    result = await Short_overview.findOne(
      { title: new RegExp(title, 'i') },
      { title: 1 },
    );
  }

  return result;
};

export const Short_overview = model<IShort_overview, Short_overviewModel>(
  'Short_overview',
  Short_overviewSchema,
);
