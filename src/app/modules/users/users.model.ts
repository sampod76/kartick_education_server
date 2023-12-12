/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { IUser, /* IUserMethods, */ UserModel } from './users.interface';

//যখন instance method ব্যবহার করা হবে তখন Schema এভাবে ডিক্লেয়ার করতে হবে
// const UserSchema = new Schema<IUser, Record<string, unknown>, IUserMethods>(
// Statics method to user this schema
const UserSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      //select --> dont show any condition this password
      select: 0,
    },

    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    moderator: {
      type: Schema.Types.ObjectId,
      ref: 'Moderator',
    },
    generalUser: {
      type: Schema.Types.ObjectId,
      ref: 'General_user',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    status: {
      type: String,
      enum: ['active', 'deactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    // strict: 'throw',
  }
);

UserSchema.statics.isUserExist = async function (
  email: string
): Promise<Pick<IUser, 'password' | 'role' | 'needsPasswordChange'> | null> {
  return await User.findOne(
    { email },
    { email: 1, password: 1, role: 1, needsPasswordChange: 1 }
  );
};

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

//password hash
UserSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );
  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
