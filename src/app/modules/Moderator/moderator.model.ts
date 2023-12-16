import { Schema,  model } from 'mongoose';
import { IModerator, ModeratorModel } from './moderator.interface';

const ModeratorSchema = new Schema<IModerator, ModeratorModel>(
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
        middleName: {
          type: String,
        },
      },
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },

  },
  {
    timestamps: true,
  }
);

export const Moderator = model<IModerator, ModeratorModel>(
  'Moderator',
  ModeratorSchema
);
