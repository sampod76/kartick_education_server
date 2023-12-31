import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { COURSE_SEARCHABLE_FIELDS } from './course.constant';
import { ICourse, ICourseFilters } from './course.interface';
import { Course } from './course.model';
import { generateCourseId } from './course.utils';

const { ObjectId } = mongoose.Types;
const createCourseByDb = async (payload: ICourse): Promise<ICourse> => {
  const isExists = await Course.isCourseExistMethod({ title: payload.title });

  if (isExists) {
    throw new ApiError(403, 'Already Exist this title');
  }
  payload.snid = await generateCourseId();
  const result = await Course.create(payload);
  return result;
};

//getAllCourseFromDb
const getAllCourseFromDb = async (
  filters: ICourseFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<ICourse[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;

  // Split the string and extract field names
  const projection: { [key: string]: number } = {};
  if (select) {
    console.log(select);
    const fieldNames = select?.split(',').map(field => field.trim());
    // Create the projection object
    fieldNames.forEach(field => {
      projection[field] = 1;
    });
  }

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: COURSE_SEARCHABLE_FIELDS.map(field =>
        //search array value
        field === 'tags'
          ? { [field]: { $in: [new RegExp(searchTerm, 'i')] } }
          : {
              [field]: new RegExp(searchTerm, 'i'),
            }
      ),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) =>
        field === 'price'
          ? { [field]: { $gte: parseInt(value as string) } }
          : field === 'author'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'category'
          ? { [field]: new Types.ObjectId(value) }
          : { [field]: value }
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

  /* 
  const result = await Course.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit)); 
  */
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
    {
      $lookup: {
        from: 'users',
        let: { id: '$author' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
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
        as: 'authorDetails',
      },
    },

    {
      $project: { author: 0 },
    },
    {
      $addFields: {
        author: {
          $cond: {
            if: { $eq: [{ $size: '$authorDetails' }, 0] },
            then: [{}],
            else: '$authorDetails',
          },
        },
      },
    },

    {
      $project: { authorDetails: 0 },
    },
    {
      $unwind: '$author',
    },
    ///***************** */ category field ******start
    {
      $lookup: {
        from: 'categories',
        let: { conditionField: '$category' }, // The field to match from the current collection
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$conditionField'], // The condition to match the fields
              },
            },
          },

          // Additional pipeline stages for the second collection (optional)
          {
            $project: {
              createdAt: 0,
              updatedAt: 0,
            },
          },
        ],
        as: 'categoryDetails', // The field to store the matched results from the second collection
      },
    },
    {
      $project: { category: 0 },
    },
    {
      $addFields: {
        category: {
          $cond: {
            if: { $eq: [{ $size: '$categoryDetails' }, 0] },
            then: [{}],
            else: '$categoryDetails',
          },
        },
      },
    },
    {
      $project: { categoryDetails: 0 },
    },
    {
      $unwind: '$category',
    },
    ///***************** */ images field ******end*********
  ];

  let result = null;
  if (select) {
    result = await Course.find(whereConditions)
      .sort({ ...sortConditions })
      .skip(Number(skip))
      .limit(Number(limit))
      .select({ ...projection });
  } else {
    result = await Course.aggregate(pipeline);
  }

  const total = await Course.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getAllCourseMilestoneModuleListFromDb = async (
  filters: ICourseFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<ICourse[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;
console.log(select);
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
      $or: COURSE_SEARCHABLE_FIELDS.map(field =>
        //search array value
        field === 'tags'
          ? { [field]: { $in: [new RegExp(searchTerm, 'i')] } }
          : {
              [field]: new RegExp(searchTerm, 'i'),
            }
      ),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) =>
        field === 'price'
          ? { [field]: { $gte: parseInt(value as string) } }
          : field === 'author'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'category'
          ? { [field]: new Types.ObjectId(value) }
          : { [field]: value }
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

  /* 
  const result = await Course.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit)); 
  */
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
   
    {
      $lookup: {
        from: 'milestones',
        let: { id: '$_id' }, // The field to match from the current collection
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$course', '$$id'] },
                  { $eq: ['$status', ENUM_STATUS.ACTIVE] },
                ], // The condition to match the fields
              },
            },
          },

          //! Additional pipeline stages for the second collection (optional)
          {
            $lookup: {
              from: 'modules',
              let: { id: '$_id' }, // The field to match from the current collection
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$milestone', '$$id'] },
                        { $eq: ['$status', ENUM_STATUS.ACTIVE] },
                      ], // The condition to match the fields
                    },
                  },
                },

                // Additional pipeline stages for the second collection (optional)

                {
                  $project: {
                    title: 1,
                    img: 1,
                  },
                },
              ],
              as: 'modules', // The field to store the matched results from the second collection
            },
          },

          //!
          {
            $project: {
              // title: 1,

              title: 1,
              img: 1,
            },
          },
        ],
        as: 'milestones', // The field to store the matched results from the second collection
      },
    },
    {
      $project: {
        title: 1,
      },
    },
    ///***************** */ images field ******end*********
  ];

  let result = null;
  if (select) {
    result = await Course.find(whereConditions)
      .sort({ ...sortConditions })
      .skip(Number(skip))
      .limit(Number(limit))
      .select({ ...projection });
  } else {
    result = await Course.aggregate(pipeline);
  }

  const total = await Course.countDocuments(whereConditions);
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
const getSingleCourseFromDb = async (id: string): Promise<ICourse | null> => {
  const result = await Course.aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: 'users',
        let: { id: '$author' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2

          //! 2nd admin lookup
          {
            $lookup: {
              from: 'admins',
              let: { id: '$admin' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$_id', '$$id'] },
                    // Additional filter conditions for collection2
                  },
                },
                // Additional stages for collection2 lookup

                {
                  $project: {
                    password: 0,
                    __v: 0,
                  },
                },
              ],
              as: 'adminDetails',
            },
          },
          {
            $project: { admin: 0 },
          },
          {
            $addFields: {
              admin: {
                $cond: {
                  if: { $eq: [{ $size: '$adminDetails' }, 0] },
                  then: [{}],
                  else: '$adminDetails',
                },
              },
            },
          },
          {
            $project: { adminDetails: 0 },
          },
          {
            $unwind: '$admin',
          },
          //! 2nd trainer lookup
          {
            $lookup: {
              from: 'trainers',
              let: { id: '$trainer' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$_id', '$$id'] },
                    // Additional filter conditions for collection2
                  },
                },
                // Additional stages for collection2 lookup

                {
                  $project: {
                    password: 0,
                    __v: 0,
                  },
                },
              ],
              as: 'trainerDetails',
            },
          },
          {
            $project: { trainer: 0 },
          },
          {
            $addFields: {
              trainer: {
                $cond: {
                  if: { $eq: [{ $size: '$trainerDetails' }, 0] },
                  then: [{}],
                  else: '$trainerDetails',
                },
              },
            },
          },
          {
            $project: { trainerDetails: 0 },
          },
          {
            $unwind: '$trainer',
          },

          {
            $project: {
              password: 0,
            },
          },
        ],
        as: 'authorDetails',
      },
    },
    {
      $project: { author: 0 },
    },
    {
      $addFields: {
        author: {
          $cond: {
            if: { $eq: [{ $size: '$authorDetails' }, 0] },
            then: [{}],
            else: '$authorDetails',
          },
        },
      },
    },
    {
      $project: { authorDetails: 0 },
    },
    {
      $unwind: '$author',
    },
    ///***************** */ category field ******start
    {
      $lookup: {
        from: 'categories',
        let: { conditionField: '$category' }, // The field to match from the current collection
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$conditionField'], // The condition to match the fields
              },
            },
          },

          // Additional pipeline stages for the second collection (optional)
          {
            $project: {
              createdAt: 0,
              updatedAt: 0,
            },
          },
        ],
        as: 'categoryDetails', // The field to store the matched results from the second collection
      },
    },
    {
      $project: { category: 0 },
    },
    {
      $addFields: {
        category: {
          $cond: {
            if: { $eq: [{ $size: '$categoryDetails' }, 0] },
            then: [{}],
            else: '$categoryDetails',
          },
        },
      },
    },
    {
      $project: { categoryDetails: 0 },
    },
    {
      $unwind: '$category',
    },
  ]);

  return result[0];
};

// update e form db
const updateCourseFromDb = async (
  id: string,
  payload: Partial<ICourse>
): Promise<ICourse | null> => {
  const { demo_video, ...otherData } = payload;
  const updateData = { ...otherData };

  if (demo_video && Object.keys(demo_video).length > 0) {
    Object.keys(demo_video).forEach(key => {
      const demo_videoKey = `demo_video.${key}`; // `demo_video.status`
      (updateData as any)[demo_videoKey] =
        demo_video[key as keyof typeof demo_video];
    });
  }
  const result = await Course.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(500, 'course update fail!!😪😭😰');
  }
  return result;
};

// delete e form db
const deleteCourseByIdFromDb = async (
  id: string,
  query: ICourseFilters
): Promise<ICourse | null> => {
  let result;
  if (query.delete === ENUM_YN.YES) {
    result = await Course.findByIdAndDelete(id);
  } else {
    result = await Course.findOneAndUpdate({ status: ENUM_STATUS.DEACTIVATE });
  }
  return result;
};

// set user reviews e form db
const courseReviewsByUserFromDb = async (): Promise<ICourse | null> => {
  return null;
};

export const CourseService = {
  createCourseByDb,
  getAllCourseFromDb,
  getSingleCourseFromDb,
  getAllCourseMilestoneModuleListFromDb,
  updateCourseFromDb,
  deleteCourseByIdFromDb,
  courseReviewsByUserFromDb,
};
