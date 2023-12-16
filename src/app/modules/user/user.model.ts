/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const userSchema = new Schema<IUser,UserModel>(
  {
    email:{
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.statics.isUserExistMethod = async function (
  email: string
): Promise<Pick<
  IUser,
  'email' | 'password' | 'role'
> | null> {
  const user = await User.findOne(
    { email },
    { id:1,email: 1, password: 1, role: 1 }
  );
  return user;
};

userSchema.statics.isPasswordMatchMethod = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean | null> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save',async function(next){
  const user = this;
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, Number(config.bycrypt_salt_rounds))
  }
  next()
})

export const User = model<IUser, UserModel>('User', userSchema);
