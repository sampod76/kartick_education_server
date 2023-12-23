import { Schema, model } from 'mongoose';
import { TrainerModel, ITrainer } from './trainer.interface';
import { GENDER_ARRAY } from '../../../constant/globalConstant';

const TrainerSchema = new Schema<ITrainer, TrainerModel>(
  {
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: GENDER_ARRAY,
    },
    email: {
      type: String,
      //unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      //unique: true,
      required: true,
    },
    address: {
      type: String,
    },
    img: {
      type: String,
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Trainer = model<ITrainer, TrainerModel>('Trainer', TrainerSchema);
