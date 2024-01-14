import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { GlossaryModel, IGlossary } from './glossary.interface';

const glossarySchema = new Schema<IGlossary, GlossaryModel>(
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
    isDelete: {
      type: String,
      default: 'yes',
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

export const Glossary = model<IGlossary, GlossaryModel>('Glossary', glossarySchema);
