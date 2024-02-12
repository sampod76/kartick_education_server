import httpStatus from 'http-status';
import { PipelineStage, Types } from 'mongoose';
import ShortUniqueId from 'short-unique-id';
import config from '../../../config/index';
import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { UserLoginHistory } from '../loginHistory/loginHistory.model';
import { ISeller } from '../seller/seller.interface';
import { Seller } from '../seller/seller.model';
import { IStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { ITrainer } from '../trainer/trainer.interface';
import { Trainer } from '../trainer/trainer.model';
import { userPipeline } from './pipeline/userPipeline';
import { userSearchableFields } from './user.constant';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IUser[] | null>> => {
  const { searchTerm, multipleRole, ...filtersData } = filters;

  filtersData.isDelete = filtersData.isDelete
    ? filtersData.isDelete
    : ENUM_YN.NO;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];
  if (searchTerm || multipleRole) {
    const value: any = [];
    if (!filters.role && multipleRole) {
      const allRoles = multipleRole.split(',').map(field => field.trim());
      allRoles.map(role => {
        value.push({ role });
      });
    }
    //! default or condition
    if (searchTerm) {
      userSearchableFields.forEach(field => {
        value.push({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        });
      });
    }
    //! total $or condition
    andConditions.push({
      $or: value,
    });
  }
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) =>
        field === 'author'
          ? {
              [field]: new Types.ObjectId(value),
            }
          : {
              [field]: value,
            },
      ),
    });
  }
  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  /* 
  const result = await Milestone.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit)); 
  */
  const pipeline: PipelineStage[] = multipleRole
    ? userPipeline.author({
        whereConditions,
        sortConditions,
        limit,
        skip,
      })
    : userPipeline.allUser({
        whereConditions,
        sortConditions,
        limit,
        skip,
      });
  const result = await User.aggregate(pipeline);

  const total = await User.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleUsers = async (id: string): Promise<IUser | null> => {
  const data = await User.findById(id).populate(
    'student admin seller trainer superAdmin',
  );
  return data;
};
const deleteSingleUsersFormDb = async (
  id: string,
  query: IUserFilters,
): Promise<IUser | null> => {
  const isExist = await User.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  let data;
  if (query.delete == 'yes') {
    data = await User.findOneAndDelete({ _id: id });
    if (isExist.role === ENUM_USER_ROLE.ADMIN) {
      await Admin.findOneAndDelete({ _id: id });
    } else if (isExist.role === ENUM_USER_ROLE.SELLER) {
      await Seller.findOneAndDelete({ _id: id });
    } else if (isExist.role === ENUM_USER_ROLE.TRAINER) {
      await Trainer.findOneAndDelete({ _id: id });
    } else if (isExist.role === ENUM_USER_ROLE.STUDENT) {
      await Student.findOneAndDelete({ _id: id });
    }
  } else {
    data = await User.findByIdAndUpdate(id, {
      status: ENUM_STATUS.DEACTIVATE,
      isDelete: ENUM_YN.YES,
    });
    if (isExist.role === ENUM_USER_ROLE.ADMIN) {
      await Admin.findByIdAndUpdate(id, {
        status: ENUM_STATUS.DEACTIVATE,
        isDelete: ENUM_YN.YES,
      });
    } else if (isExist.role === ENUM_USER_ROLE.SELLER) {
      await Seller.findByIdAndUpdate(id, {
        status: ENUM_STATUS.DEACTIVATE,
        isDelete: ENUM_YN.YES,
      });
    } else if (isExist.role === ENUM_USER_ROLE.TRAINER) {
      await Trainer.findByIdAndUpdate(id, {
        status: ENUM_STATUS.DEACTIVATE,
        isDelete: ENUM_YN.YES,
      });
    } else if (isExist.role === ENUM_USER_ROLE.STUDENT) {
      await Student.findByIdAndUpdate(id, {
        status: ENUM_STATUS.DEACTIVATE,
        isDelete: ENUM_YN.YES,
      });
    }
  }
  return data;
};

const updateUserSingleUsersFormDb = async (
  id: string,
  bodyData: IUser,
  req: Request | any,
): Promise<IUser | null> => {
  const isExist = await User.findById(id).lean();

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (
    isExist?.author?.toString() !== id &&
    req?.user?.role !== ENUM_USER_ROLE.ADMIN &&
    isExist?.author?.toString() !== req?.user?.id
  ) {
    throw new ApiError(500, 'Unauthorize user');
  }
  const data = await User.findByIdAndUpdate(id, {
    ...bodyData,
  });
await UserLoginHistory.find({ user: new Types.ObjectId(id) });

  if (data && bodyData?.status === ENUM_STATUS.DEACTIVATE) {
    await UserLoginHistory.updateMany(
      { user: new Types.ObjectId(id) },
      { status: ENUM_STATUS.DEACTIVATE },
    );
  } else if (data && bodyData?.status === ENUM_STATUS.ACTIVE) {
    await UserLoginHistory.updateMany(
      { user: new Types.ObjectId(id) },
      { status: ENUM_STATUS.ACTIVE },
    );
  }
  if (isExist.role === ENUM_USER_ROLE.ADMIN) {
    await Admin.findByIdAndUpdate(id, {
      ...bodyData,
    });
  } else if (isExist.role === ENUM_USER_ROLE.SELLER) {
    await Seller.findByIdAndUpdate(id, {
      ...bodyData,
    });
  } else if (isExist.role === ENUM_USER_ROLE.TRAINER) {
    await Trainer.findByIdAndUpdate(id, {
      ...bodyData,
    });
  } else if (isExist.role === ENUM_USER_ROLE.STUDENT) {
    await Student.findByIdAndUpdate(id, {
      ...bodyData,
    });
  }

  return data;
};

const createAdminService = async (
  admin: IAdmin,
  user: IUser,
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_admin_pass as string;
  }
  const exist = await User.findOne({
    email: user.email,
    isDelete: ENUM_YN.YES,
  });
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  // set role
  user.role = ENUM_USER_ROLE.ADMIN;

  let newUserAllData = null;
  const newAdmin = await Admin.create(admin);
  if (newAdmin) {
    user.admin = newAdmin?._id;
    newUserAllData = await User.create(user);
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await Admin.findByIdAndDelete(newAdmin._id);
    throw new ApiError(404, 'Admin create failed');
  }
  // const session = await mongoose.startSession();
  // try {
  //   session.startTransaction();

  //   // const id = await generateAdminId();
  //   // user.id = id;
  //   // admin.id = id;

  //   const newAdmin = await Admin.create([admin], { session });

  //   if (!newAdmin.length) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin ');
  //   }

  //   user.admin = newAdmin[0]._id;

  //   const newUser = await User.create([user], { session });

  //   if (!newUser.length) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
  //   }
  //   newUserAllData = newUser[0];

  //   await session.commitTransaction();
  //   await session.endSession();
  // } catch (error) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw error;
  // }
  // if (newUserAllData) {
  //   newUserAllData = await User.findOne({ id: newUserAllData.id });
  // }

  return newUserAllData;
};
const createStudentService = async (
  student: IStudent,
  user: IUser,
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  const exist = await User.findOne({
    email: user.email,
    isDelete: ENUM_YN.YES,
  });
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exist');
  }
  // set role
  user.role = ENUM_USER_ROLE.STUDENT;
  const uid = new ShortUniqueId({ length: 8 });
  user.userId = `S-${uid.rnd()}`;
  student.userId = `S-${uid.rnd()}`;
  let newUserAllData = null;
  const newStudent = await Student.create(student);
  if (newStudent) {
    user.student = newStudent?._id;
    newUserAllData = await User.create(user);
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await Student.findByIdAndDelete(newStudent._id);
    throw new ApiError(404, 'Admin create failed');
  }
  // const session = await mongoose.startSession();
  // try {
  //   session.startTransaction();

  //   //array
  //   const newStudent = await Student.create([student], { session });

  //   if (!newStudent.length) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student');
  //   }
  //   //set student -->  _id into user.student
  //   user.student = newStudent[0]._id;

  //   const newUser = await User.create([user], { session });

  //   if (!newUser.length) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  //   }
  //   newUserAllData = newUser[0];

  //   await session.commitTransaction();
  //   await session.endSession();
  // } catch (error) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw error;
  // }

  // if (newUserAllData) {
  //   newUserAllData = await User.findOne({ id: newUserAllData.id });
  // }

  return newUserAllData;
};

const createStudentByOtherMemberService = async (
  student: IStudent,
  user: IUser,
): Promise<IUser | null> => {

  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  const uid = new ShortUniqueId({ length: 8 });
  const userId = student?.userId || `S${uid.rnd()}`;
  user.userId = userId;
  student.userId = userId;

  // const exist = await User.isUserExistMethod(user.email);
  // if (exist) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exist');
  // }
  // set role
  user.role = ENUM_USER_ROLE.STUDENT;
  user.email = userId + '.' + student?.email;
  student.email = userId + '.' + student?.email;

  let newUserAllData = null;
  const newStudent = await Student.create(student);
  if (newStudent) {
    user.student = newStudent?._id;
    newUserAllData = await User.create(user);
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await Student.findByIdAndDelete(newStudent._id);
    throw new ApiError(404, 'Student create failed');
  }
  // const session = await mongoose.startSession();
  // try {
  //   session.startTransaction();

  //   //array
  //   const newStudent = await Student.create([student], { session });

  //   if (!newStudent.length) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student');
  //   }
  //   //set student -->  _id into user.student
  //   user.student = newStudent[0]._id;

  //   const newUser = await User.create([user], { session });

  //   if (!newUser.length) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  //   }
  //   newUserAllData = newUser[0];

  //   await session.commitTransaction();
  //   await session.endSession();
  // } catch (error) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw error;
  // }

  // if (newUserAllData) {
  //   newUserAllData = await User.findOne({ id: newUserAllData.id });
  // }

  return newUserAllData;
};

const createTrainerService = async (
  trainer: ITrainer,
  user: IUser,
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  const exist = await User.findOne({
    email: user.email,
    isDelete: ENUM_YN.YES,
  });
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  const uid = new ShortUniqueId({ length: 8 });
  user.userId = `T-${uid.rnd()}`;
  trainer.userId = `T-${uid.rnd()}`;
  // set role
  user.role = ENUM_USER_ROLE.TRAINER;

  let newUserAllData = null;
  const newTrainer = await Trainer.create(trainer);
  if (newTrainer) {
    user.trainer = newTrainer?._id;
    newUserAllData = await User.create(user);
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await Trainer.findByIdAndDelete(newTrainer._id);
    throw new ApiError(404, 'Admin create failed');
  }
  // const session = await mongoose.startSession();
  // try {
  //   session.startTransaction();
  //   //array
  //   const newTrainer = await Trainer.create([trainer], { session });
  //   if (!newTrainer.length) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Trainer');
  //   }
  //   //set Trainer -->  _id into user.student
  //   user.trainer = newTrainer[0]._id;
  //   const newUser = await User.create([user], { session });
  //   if (!newUser.length) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  //   }
  //   newUserAllData = newUser[0];
  //   await session.commitTransaction();
  //   await session.endSession();
  // } catch (error) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw error;
  // }

  // if (newUserAllData) {
  //   newUserAllData = await User.findOne({ id: newUserAllData.id });
  // }

  return newUserAllData;
};
const createSellerService = async (
  seller: ISeller,
  user: IUser,
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  const exist = await User.isUserExistMethod(user.email);
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exist');
  }
  // set role
  user.role = ENUM_USER_ROLE.SELLER;
  //
  const uid = new ShortUniqueId({ length: 8 });
  user.userId = `T${uid.rnd()}`;
  seller.userId = `T${uid.rnd()}`;
  //
  let newUserAllData = null;
  const newSeller = await Seller.create(seller);
  if (newSeller) {
    user.seller = newSeller?._id;
    newUserAllData = await User.create(user);
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await Seller.findByIdAndDelete(newSeller._id);
    throw new ApiError(404, 'Admin create failed');
  }
  // const session = await mongoose.startSession();
  // try {
  //   session.startTransaction();

  //   //array
  //   const newSeller = await Seller.create([seller], { session });

  //   if (!newSeller.length) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Seller');
  //   }
  //   //set Seller -->  _id into user.Seller
  //   user.seller = newSeller[0]._id;

  //   const newUser = await User.create([user], { session });

  //   if (!newUser.length) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  //   }
  //   newUserAllData = newUser[0];

  //   await session.commitTransaction();
  //   await session.endSession();
  // } catch (error) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw error;
  // }

  // if (newUserAllData) {
  //   newUserAllData = await User.findOne({ id: newUserAllData.id });
  // }

  return newUserAllData;
};

export const UserService = {
  createStudentService,
  createAdminService,
  createTrainerService,
  createSellerService,
  getAllUsers,
  getSingleUsers,
  deleteSingleUsersFormDb,
  createStudentByOtherMemberService,
  updateUserSingleUsersFormDb,
};
