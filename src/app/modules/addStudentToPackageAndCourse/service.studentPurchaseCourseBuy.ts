import { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import { ENUM_USER_ROLE } from '../../../enums/users';
import ApiError from '../../errors/ApiError';
import { PurchasePackage } from '../purchase_package/purchase_package.model';
import { student_purchase_category_course_SEARCHABLE_FIELDS } from './constant.studentPurchaseCourseBuy';
import {
  IStudentPurchasePackageCategoryCourse,
  IStudentPurchasePackageCategoryCourseFilters,
} from './interface.studentPurchaseCourseBuy';
import { AddSellerStudentPurchasePackageCategoryCourse } from './model.studentPurchaseCourseBuy';

const createStudentPurchasePackageCategoryCourseByDb = async (
  payload: IStudentPurchasePackageCategoryCourse,
): Promise<IStudentPurchasePackageCategoryCourse | null> => {
  const findPackage =
    await AddSellerStudentPurchasePackageCategoryCourse.findOne({
      sellerPackage: payload.sellerPackage,
      user: payload.user,
      isDelete: ENUM_YN.NO,
    });

  let result;
  if (findPackage) {
    throw new ApiError(400, 'This package is already have');
  } else {
    const findSellerPackage = await PurchasePackage.findOne({
      _id: payload.sellerPackage,
      user: payload.author,
    });

    if (
      findSellerPackage &&
      new Date(findSellerPackage?.expiry_date)?.getTime() < Date.now()
    ) {
      throw new ApiError(400, 'Your package has expired please Renew it');
    } else if (
      findSellerPackage &&
      findSellerPackage?.total_purchase_student ===
        findSellerPackage.students.length
    ) {
      throw new ApiError(400, 'Your Student limit has over');
    } else {
      await PurchasePackage.findOneAndUpdate(
        {
          _id: payload.sellerPackage,
          user: payload.author,
        },
        {
          $push: { students: { $each: [payload.user] } },
        },
      );

      result = await AddSellerStudentPurchasePackageCategoryCourse.create({
        ...payload,
      });
    }
  }

  // const result = await AddSellerStudentPurchasePackageCategoryCourse.create({ ...payload });
  return result;
};

//getAllQuizFromDb
const getAllStudentPurchasePackageCategoryCourseFromDb = async (
  filters: IStudentPurchasePackageCategoryCourseFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IStudentPurchasePackageCategoryCourse[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;
  filtersData.isDelete = filtersData.isDelete
    ? filtersData.isDelete
    : ENUM_YN.NO;

  // Split the string and extract field names
  const projection: { [key: string]: number } = {};
  if (select) {
    const fieldNames = select?.split(',').map(field => field.trim());
    // Create the projection object
    fieldNames.forEach(field => {
      projection[field] = 1;
    });
  }

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: student_purchase_category_course_SEARCHABLE_FIELDS.map(field =>
        //search array value
        field === 'tags'
          ? { [field]: { $in: [new RegExp(searchTerm, 'i')] } }
          : {
              [field]: new RegExp(searchTerm, 'i'),
            },
      ),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) =>
        field === 'sellerPackage'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'course'
            ? { [field]: new Types.ObjectId(value) }
            : field === 'category'
              ? { [field]: new Types.ObjectId(value) }
              : field === 'author'
                ? { [field]: new Types.ObjectId(value) }
                : field === 'user'
                  ? { [field]: new Types.ObjectId(value) }
                  : { [field]: value },
      ),
    });
  }

  //****************search and filters end**********/

  //****************pagination start **************/

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // const result = await AddSellerStudentPurchasePackageCategoryCourse.find(whereConditions)
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit))
  //   .populate('user')
  //   .populate('author')
  //   .populate('sellerPackage')
  //   .populate('course');

  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
    {
      $lookup: {
        from: 'purchasepackages',
        let: {
          id: '$sellerPackage',
          // label: '$categories.label',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$id'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                  // { $gt: ['$expiry_date', new Date()] },
                ],
              },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2
          {
            $lookup: {
              from: 'categories',
              localField: 'categories.category',
              foreignField: '_id',
              as: 'categoriesDetails',
            },
          },

          // {
          //   $unwind: '$categoriesDetails',
          // },
          // {
          //   $project: {
          //     title: 1,
          //     img: 1,
          //     // categories: '$$categories',
          //   },
          // },
        ],
        as: 'sellerPackageDetails',
      },
    },
    { $unwind: '$sellerPackageDetails' },
    {
      $lookup: {
        from: 'users',
        let: { id: '$user' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $ne: ['$$id', undefined] }, { $eq: ['$_id', '$$id'] }],
              },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2
          // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি

          {
            $project: {
              password: 0,
            },
          },
        ],
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
  ];

  let result = null;
  if (select) {
    result = await AddSellerStudentPurchasePackageCategoryCourse.find({})
      .sort({ title: 1 })
      .select({ ...projection });
  } else {
    result =
      await AddSellerStudentPurchasePackageCategoryCourse.aggregate(pipeline);
  }

  const total =
    await AddSellerStudentPurchasePackageCategoryCourse.countDocuments(
      whereConditions,
    );
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single e form db
const getStudentPurchasePackageCategoryCourseVerifyFromDb = async (
  id: string,
  user: any,
): Promise<IStudentPurchasePackageCategoryCourse[] | null> => {
  const findSubmitQuiz =
    await AddSellerStudentPurchasePackageCategoryCourse.find({
      quiz: new Types.ObjectId(id as string),
      user: new Types.ObjectId(user.id as string),
    });

  return findSubmitQuiz;
};
const getStudentPurchasePackageCategoryCourseSingelFromDb = async (
  id: string,
): Promise<IStudentPurchasePackageCategoryCourse | null> => {
  // const result = await AddSellerStudentPurchasePackageCategoryCourse.aggregate([
  //   { $match: { _id: new ObjectId(id) } },
  // ]);

  // return result[0];
  const result = await AddSellerStudentPurchasePackageCategoryCourse.findById(
    id,
  )
    .populate('user')
    .populate('author')
    .populate('sellerPackage')
    .populate('course');

  return result;
};
const updateStudentPurchasePackageCategoryCourseFromDb = async (
  id: string,
  payload: Partial<IStudentPurchasePackageCategoryCourse>,
  req: any,
): Promise<IStudentPurchasePackageCategoryCourse | null> => {
  const find = await AddSellerStudentPurchasePackageCategoryCourse.findOne({
    author: req?.user?.id,
    _id: id,
  });
  console.log('🚀 ~ find:', find);
  if (!find) {
    throw new ApiError(400, 'Not Found');
  }
  if (
    req?.user?.role !== ENUM_USER_ROLE.ADMIN &&
    find?.author?.toString() !== req?.user?.id
  ) {
    throw new ApiError(400, 'Unauthorize');
  }
  const result =
    await AddSellerStudentPurchasePackageCategoryCourse.findOneAndUpdate(
      { _id: id },
      payload,
      {
        new: true,
        runValidators: true,
      },
    );
  if (!result) {
    throw new ApiError(500, 'Module update fail!!😪😭😰');
  }
  return result;
};
// delete e form db
const deleteStudentPurchasePackageCategoryCourseByIdFromDb = async (
  id: string,
  query: IStudentPurchasePackageCategoryCourseFilters,
  user?: any,
): Promise<IStudentPurchasePackageCategoryCourse | null> => {
  if (user.role !== ENUM_USER_ROLE.ADMIN) {
    const find = await AddSellerStudentPurchasePackageCategoryCourse.findOne({
      author: user.id,
      _id: id,
    });
    if (!find) {
      throw new ApiError(400, 'Unauthorize');
    }
  }
  let result;
  if (query.delete === ENUM_YN.YES) {
    result =
      await AddSellerStudentPurchasePackageCategoryCourse.findByIdAndDelete(id);
  } else {
    result =
      await AddSellerStudentPurchasePackageCategoryCourse.findOneAndUpdate(
        { _id: id },
        { status: ENUM_STATUS.DEACTIVATE, isDelete: ENUM_YN.YES },
      );
  }
  return result;
};

export const StudentPurchasePackageCategoryCourseService = {
  createStudentPurchasePackageCategoryCourseByDb,
  getAllStudentPurchasePackageCategoryCourseFromDb,
  getStudentPurchasePackageCategoryCourseSingelFromDb,
  deleteStudentPurchasePackageCategoryCourseByIdFromDb,
  getStudentPurchasePackageCategoryCourseVerifyFromDb,
  updateStudentPurchasePackageCategoryCourseFromDb,
};
