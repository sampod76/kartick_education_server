import { PipelineStage, Types } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_YN } from '../../../enums/globalEnums';
import { ASSESSMENT_SEARCHABLE_FIELDS } from './consent.assignment';
import { IAssignment, IAssignmentFilters } from './interface.assignment';
import { Assignment } from './model.assignment';

const createAssignmentByDb = async (
  payload: IAssignment,
): Promise<IAssignment> => {
  // const find = await Assignment.findOne({ title: payload.title, isDelete: true });
  // if (find) {
  //   throw new ApiError(400, 'This Assignment All Ready Exist');
  // }
  const result = await Assignment.create(payload);
  return result;
};

//getAllAssignmentFromDb
const getAllAssignmentFromDb = async (
  filters: IAssignmentFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IAssignment[]> | any> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;

  filtersData.isDelete = filtersData.isDelete
    ? filtersData.isDelete
    : ENUM_YN.NO;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: ASSESSMENT_SEARCHABLE_FIELDS.map(field => ({
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
          field === 'module'
        ) {
          modifyFiled = { [field]: new Types.ObjectId(value) };
        } else {
          modifyFiled = { [field]: value };
        }
        // console.log(modifyFiled);
        return modifyFiled;
      },
    );
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

  // const result = await Assignment.find(whereConditions)
  //   .populate('thumbnail')
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit));
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 99999 },
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
  ];

  // console.log(pipeline);
  const result = await Assignment.aggregate(pipeline);
  // console.log(result, 127);
  const total = await Assignment.countDocuments(whereConditions);
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
const getSingleAssignmentFromDb = async (
  id: string,
): Promise<IAssignment | null> => {
  const pipeline: PipelineStage[] = [
    { $match: { _id: new Types.ObjectId(id) } },
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

  const result = await Assignment.aggregate(pipeline);

  return result[0];
};

// update Assignmente form db
const updateAssignmentFromDb = async (
  id: string,
  payload: Partial<IAssignment>,
): Promise<IAssignment | null> => {
  const result = await Assignment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// delete Assignmente form db
const deleteAssignmentByIdFromDb = async (
  id: string,
): Promise<IAssignment | null> => {
  const result = await Assignment.findOneAndDelete({ _id: id });
  return result;
};
//

export const AssignmentService = {
  createAssignmentByDb,
  getAllAssignmentFromDb,
  getSingleAssignmentFromDb,
  updateAssignmentFromDb,
  deleteAssignmentByIdFromDb,
};
