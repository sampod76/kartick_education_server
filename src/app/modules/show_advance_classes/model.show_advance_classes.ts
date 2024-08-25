import { Schema, Types, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import {
  IShow_advance_classes,
  Show_advance_classesModel,
} from './interface.show_advance_classes';

const Show_advance_classesSchema = new Schema<
  IShow_advance_classes,
  Show_advance_classesModel
>(
  {
    title: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },

    buttonLink: { type: String },
    classes: {
      type: [
        {
          title: { type: String, required: true },
          img: { type: String, required: true },
          short_description: { type: String, required: true },
          buttonLink: { type: String },
          course: { type: Types.ObjectId, ref: 'Course' },
        },
      ],
      required: true,
    },
    page: {
      type: String,
      trim: true,
      default:"home"
    },
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
Show_advance_classesSchema.statics.isShow_advance_classesExistMethod =
  async function ({
    id,
    title,
  }: {
    id?: string;
    title?: string;
  }): Promise<Pick<IShow_advance_classes, 'title'> | null> {
    let result = null;
    if (id) {
      result = await Show_advance_classes.findById(id);
    }
    if (title) {
      result = await Show_advance_classes.findOne(
        { title: new RegExp(title, 'i') },
        { title: 1 },
      );
    }

    return result;
  };

export const Show_advance_classes = model<
  IShow_advance_classes,
  Show_advance_classesModel
>('Show_advance_classes', Show_advance_classesSchema);
