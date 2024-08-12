/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PipelineStage, Types } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_YN } from '../../../enums/globalEnums';
import { ENUM_USER_ROLE } from '../../../enums/users';
import ApiError from '../../errors/ApiError';
import { User } from '../user/user.model';
import { SubmitAssignment_SEARCHABLE_FIELDS } from './consent.submit_assignment';
import {
  ISubmitAssignment,
  ISubmitAssignmentFilters,
} from './interface.submit_assignment';
import { SubmitAssignment } from './model.submit_assignment';

const createSubmitAssignmentByDb = async (
  payload: ISubmitAssignment,
): Promise<ISubmitAssignment> => {
  const findUser = await User.findById(payload.author);
  if (findUser?.role !== ENUM_USER_ROLE.STUDENT) {
    throw new ApiError(400, 'Only student can submit assignment');
  }
  payload = {
    ...payload,
    accountCreateAuthor: findUser?.author as any,
  };
  const find = await SubmitAssignment.findOne({
    assignment: payload.assignment,
    authorEmail: payload.authorEmail,
    isDelete: 'no',
  });
  if (find) {
    throw new ApiError(400, 'Already submitted this assignment');
  }
  const result = await SubmitAssignment.create(payload);
  return result;
};

//getAllSubmitAssignmentFromDb
const getAllSubmitAssignmentFromDb = async (
  filters: ISubmitAssignmentFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<ISubmitAssignment[]> | any> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;
  // console.log('🚀 ~ filtersData:', filtersData);

  filtersData.isDelete = filtersData.isDelete
    ? filtersData.isDelete
    : ENUM_YN.NO;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: SubmitAssignment_SEARCHABLE_FIELDS.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filtersData).length) {
    const condition = Object.entries(filtersData).map(
      //@ts-ignore
      ([field, value]: [keyof typeof filtersData, string]) => {
        let modifyFiled;

        if (
          field === 'author' ||
          field === 'category' ||
          field === 'course' ||
          field === 'lesson' ||
          field === 'milestone' ||
          field === 'module' ||
          field === 'assignment' ||
          field === 'accountCreateAuthor'
        ) {
          modifyFiled = { [field]: new Types.ObjectId(value) };
        } else {
          modifyFiled = { [field]: value };
        }

        return modifyFiled;
      },
    );
    andConditions.push({ $and: condition });
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

  // const result = await SubmitAssignment.find(whereConditions)
  //   .populate('thumbnail')
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit));
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 99999 },
    //*******assignment******* */
    {
      $lookup: {
        from: 'assignments',
        let: { id: '$assignment' },
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
        as: 'assignmentDetails',
      },
    },

    {
      $project: { assignment: 0 },
    },
    {
      $addFields: {
        assignment: {
          $cond: {
            if: { $eq: [{ $size: '$assignmentDetails' }, 0] },
            then: [{}],
            else: '$assignmentDetails',
          },
        },
      },
    },

    {
      $project: { assignmentDetails: 0 },
    },
    {
      $unwind: '$assignment',
    },
    //************assignment *******end */
    //*******author******* */
    {
      $lookup: {
        from: 'users',
        let: { id: '$author' },
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
    //************author *******end */
    {
      $lookup: {
        from: 'lessons',
        let: { id: '$lesson' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$id'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ],
              },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2

          {
            $project: {
              title: 1,
              lesson_number: 1,
            },
          },
        ],
        as: 'lessonDetails',
      },
    },

    {
      $project: { lesson: 0 },
    },
    {
      $addFields: {
        lesson: {
          $cond: {
            if: { $eq: [{ $size: '$lessonDetails' }, 0] },
            then: [{}],
            else: '$lessonDetails',
          },
        },
      },
    },
    {
      $project: { lessonDetails: 0 },
    },
    {
      $unwind: '$lesson',
    },
    //-----------course-------------------
    {
      $lookup: {
        from: 'courses',
        let: { id: '$course' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$id'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ],
              },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2
          // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি
          {
            $lookup: {
              from: '_id',
              let: { id: '$categories' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$_id', '$$id'] },
                        { $eq: ['$isDelete', ENUM_YN.NO] },
                      ],
                    },
                    // Additional filter conditions for collection2
                  },
                },
                // Additional stages for collection2
                // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি

                {
                  $project: {
                    title: 1,
                  },
                },
              ],
              as: 'category',
            },
          },
          {
            $project: {
              title: 1,
            },
          },
        ],
        as: 'courseDetails',
      },
    },

    {
      $project: { course: 0 },
    },
    {
      $addFields: {
        course: {
          $cond: {
            if: { $eq: [{ $size: '$courseDetails' }, 0] },
            then: [{}],
            else: '$courseDetails',
          },
        },
      },
    },

    {
      $project: { courseDetails: 0 },
    },
    {
      $unwind: '$course',
    },
  ];

  // console.log(pipeline);
  const result = await SubmitAssignment.aggregate(pipeline);
  // console.log(result, 127);
  const total = await SubmitAssignment.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single Assignmente form db
const getSingleSubmitAssignmentFromDb = async (
  id: string,
): Promise<ISubmitAssignment | null> => {
  const pipeline: PipelineStage[] = [
    { $match: { _id: new Types.ObjectId(id) } },
    //*******assignment******* */
    {
      $lookup: {
        from: 'users',
        let: { id: '$assignment' },
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
        as: 'assignmentDetails',
      },
    },

    {
      $project: { assignment: 0 },
    },
    {
      $addFields: {
        assignment: {
          $cond: {
            if: { $eq: [{ $size: '$assignmentDetails' }, 0] },
            then: [{}],
            else: '$assignmentDetails',
          },
        },
      },
    },

    {
      $project: { assignmentDetails: 0 },
    },
    {
      $unwind: '$assignment',
    },
    //************assignment *******end */
    //*******author******* */
    {
      $lookup: {
        from: 'users',
        let: { id: '$author' },
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
    //************author *******end */
    {
      $lookup: {
        from: 'lessons',
        let: { id: '$lesson' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$id'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ],
              },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2

          {
            $project: {
              title: 1,
              lesson_number: 1,
            },
          },
        ],
        as: 'lessonDetails',
      },
    },

    {
      $project: { lesson: 0 },
    },
    {
      $addFields: {
        lesson: {
          $cond: {
            if: { $eq: [{ $size: '$lessonDetails' }, 0] },
            then: [{}],
            else: '$lessonDetails',
          },
        },
      },
    },
    {
      $project: { lessonDetails: 0 },
    },
    {
      $unwind: '$lesson',
    },
    ///***************** */ images field ******start
  ];

  const result = await SubmitAssignment.aggregate(pipeline);

  return result[0];
};

// update Assignmente form db
const updateSubmitAssignmentFromDb = async (
  id: string,
  payload: Partial<ISubmitAssignment>,
): Promise<ISubmitAssignment | null> => {
  console.log('🚀 ~ payload:', payload);
  const result = await SubmitAssignment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// delete Assignmente form db
const deleteSubmitAssignmentByIdFromDb = async (
  id: string,
): Promise<ISubmitAssignment | null> => {
  const result = await SubmitAssignment.findOneAndDelete({ _id: id });
  return result;
};
//

export const SubmitAssignmentService = {
  createSubmitAssignmentByDb,
  getAllSubmitAssignmentFromDb,
  getSingleSubmitAssignmentFromDb,
  updateSubmitAssignmentFromDb,
  deleteSubmitAssignmentByIdFromDb,
};
