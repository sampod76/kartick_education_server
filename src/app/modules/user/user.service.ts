import { User } from './user.model';
import { IUser } from './user.interface';

import { generateUserId } from './user.utils';
import ApiError from '../../errors/ApiError';

const createUser = async (user: IUser): Promise<IUser | null> => {
  // auto generated incremental id
  const id = await generateUserId();
  user.userId = id;
  // default password
  if (!user.password) {
    throw new ApiError(500, 'Please enter a password');
  }
  const createdUser = await User.create(user);
  if (!createdUser) {
    throw new ApiError(400, 'Failed to create user');
  }
  return createdUser;
};

const getAllUsersFromDB = async (): Promise<IUser[] | null> => {
  const users = await User.find({}).lean();
  if (!users) {
    throw new ApiError(400, 'Failed to get users');
  }
  return users;
};

const updateUserFromDB = async (
  id: string,
  user: IUser,
): Promise<IUser | null> => {
  const updatedUser = await User.findOneAndUpdate({ _id: id }, user, {
    new: true,
  });
  if (!updatedUser) {
    throw new ApiError(400, 'Failed to update user');
  }
  return updatedUser;
};

const getSingleUserFromDB = async (id: string): Promise<IUser | null> => {
  const user = await User.findOne({ _id: id }).select('-password');
  if (!user) {
    throw new ApiError(400, 'Failed to get user');
  }
  return user;
};

const deleteUserFromDB = async (id: string): Promise<IUser | null> => {
  const deletedUser = await User.findOneAndDelete({ _id: id });
  if (!deletedUser) {
    throw new ApiError(400, 'Failed to delete user');
  }
  return deletedUser;
};

export const UserService = {
  createUser,
  getAllUsersFromDB,
  updateUserFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
};
