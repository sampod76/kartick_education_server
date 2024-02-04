/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
      index: true,
      //unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    additionalRole: {
      type: String,
    },
    userId: {
      type: String,
    },
    user_agent: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
    },
    blockingTimeout: {
      type: Number,
      default: 0,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
    moderator: {
      type: Schema.Types.ObjectId,
      ref: 'Moderator',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    superAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'SuperAdmin',
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: 'Trainer',
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isDelete: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.statics.isUserExistMethod = async function (
  email: string,
): Promise<Pick<IUser, 'email' | 'password' | 'role'> | null> {
  const user = await User.findOne(
    { email },
    { id: 1, email: 1, password: 1, role: 1 },
  );
  return user;
};

userSchema.statics.isPasswordMatchMethod = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean | null> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
  try {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(
        user.password,
        Number(config.bycrypt_salt_rounds),
      );
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

export const User = model<IUser, UserModel>('User', userSchema);
