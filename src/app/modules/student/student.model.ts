import { Schema, model } from 'mongoose';
import { bloodGroup, gender } from './student.constant';
import { IStudent, StudentModel } from './student.interface';

export const StudentSchema = new Schema<IStudent, StudentModel>(
  {
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          // required: true,
        },
        middleName: {
          type: String,
          required: false,
        },
      },
      required: true,
    },
    gender: {
      type: String,
      enum: gender,
    },
    dateOfBirth: {
      type: String,
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
    bloodGroup: {
      type: String,
      enum: bloodGroup,
    },
   address: {
      type: String,
      required: true,
    },

    courseId: {
      type: Schema.Types.ObjectId, 
      ref: 'Course',
    },
    img: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Student = model<IStudent, StudentModel>('Student', StudentSchema);
