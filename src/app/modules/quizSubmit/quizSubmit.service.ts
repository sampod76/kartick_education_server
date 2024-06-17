import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { QUIZ_SUBMIT_SEARCHABLE_FIELDS } from './quizSubmit.constant';
import { IQuizSubmit, IQuizSubmitFilters } from './quizSubmit.interface';
import { QuizSubmit } from './quizSubmit.model';

const { ObjectId } = mongoose.Types;
const createQuizSubmitByDb = async (
  payload: IQuizSubmit,
  user: any,
): Promise<IQuizSubmit | null> => {
  const findSubmitQuiz = await QuizSubmit.findOne({
    quiz: new Types.ObjectId(payload.quiz as string),
    singleQuiz: new Types.ObjectId(payload.singleQuiz as string),
    user: new Types.ObjectId(user.id as string),
  });

  let result;
  if (findSubmitQuiz) {
    throw new ApiError(400, 'You are already submit this quiz');
  } else {
    result = (await QuizSubmit.create({ ...payload, user: user.id })).populate(
      'singleQuiz',
    );
  }

  return result;
};

//getAllQuizFromDb
const getAllQuizSubmitFromDb = async (
  filters: IQuizSubmitFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IQuizSubmit[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;
  filtersData.status = filtersData.status
    ? filtersData.status
    : ENUM_STATUS.ACTIVE;
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
      $or: QUIZ_SUBMIT_SEARCHABLE_FIELDS.map(field =>
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
        field === 'category'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'course'
            ? { [field]: new Types.ObjectId(value) }
            : field === 'milestone'
              ? { [field]: new Types.ObjectId(value) }
              : field === 'module'
                ? { [field]: new Types.ObjectId(value) }
                : field === 'lesson'
                  ? { [field]: new Types.ObjectId(value) }
                  : field === 'user'
                    ? { [field]: new Types.ObjectId(value) }
                    : field === 'quiz'
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

  /* 
  const result = await Milestone.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit)); 
  */
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
  ];

  let result = null;
  if (select) {
    result = await QuizSubmit.find({})
      .sort({ title: 1 })
      .select({ ...projection });
  } else {
    result = await QuizSubmit.aggregate(pipeline);
  }

  const total = await QuizSubmit.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
//getAllQuizFromDb
const getQuizSubmitAnalyticsFromDb = async (
  filters: IQuizSubmitFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IQuizSubmit[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;
  filtersData.status = filtersData.status
    ? filtersData.status
    : ENUM_STATUS.ACTIVE;
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
      $or: QUIZ_SUBMIT_SEARCHABLE_FIELDS.map(field =>
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
        field === 'category'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'course'
            ? { [field]: new Types.ObjectId(value) }
            : field === 'milestone'
              ? { [field]: new Types.ObjectId(value) }
              : field === 'module'
                ? { [field]: new Types.ObjectId(value) }
                : field === 'lesson'
                  ? { [field]: new Types.ObjectId(value) }
                  : field === 'user'
                    ? { [field]: new Types.ObjectId(value) }
                    : field === 'quiz'
                      ? { [field]: new Types.ObjectId(value) }
                      : { [field]: value },
      ),
    });
  }

  //****************search and filters end**********/

  //****************pagination start **************/

  const { page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

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
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    // Lookup for category details
    {
      $lookup: {
        from: 'categories',
        let: { conditionField: '$category' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$conditionField'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ],
              },
            },
          },
          {
            $project: {
              title: 1,
              serial_number: 1,
            },
          },
        ],
        as: 'categoryDetails',
      },
    },
    // Project category details
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
      $project: { categoryDetails: 0, details: 0 },
    },
    {
      $unwind: '$category',
    },
    // Lookup for course details
    {
      $lookup: {
        from: 'courses',
        let: { conditionField: '$course' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$conditionField'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ],
              },
            },
          },
          {
            $project: {
              title: 1,
              showing_number: 1,
            },
          },
        ],
        as: 'courseDetails',
      },
    },
    // Project course details
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
      $project: { courseDetails: 0, details: 0 },
    },
    {
      $unwind: '$course',
    },
    // Lookup for milestone details
    {
      $lookup: {
        from: 'milestones',
        let: { conditionField: '$milestone' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$conditionField'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ],
              },
            },
          },
          {
            $project: {
              title: 1,
              showing_number: 1,
              modules: 1,
            },
          },
        ],
        as: 'milestoneDetails',
      },
    },
    // Project milestone details
    {
      $project: { milestone: 0 },
    },
    {
      $addFields: {
        milestone: {
          $cond: {
            if: { $eq: [{ $size: '$milestoneDetails' }, 0] },
            then: [{}],
            else: '$milestoneDetails',
          },
        },
      },
    },
    {
      $project: { milestoneDetails: 0, details: 0 },
    },
    {
      $unwind: '$milestone',
    },
    {
      $lookup: {
        from: 'modules',
        let: { id: '$module' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $ne: ['$$id', undefined] }, { $eq: ['$_id', '$$id'] }],
              },
              // Additional filter conditions for collection2
            },
          },
        ],
        as: 'moduleDetails',
      },
    },

    {
      $project: { module: 0 },
    },
    {
      $addFields: {
        module: {
          $cond: {
            if: { $eq: [{ $size: '$moduleDetails' }, 0] },
            then: [{}],
            else: '$moduleDetails',
          },
        },
      },
    },
    {
      $project: { moduleDetails: 0 },
    },
    {
      $unwind: '$module',
    },

    // Group by milestones in module
    {
      $group: {
        _id: {
          categoryId: '$category._id',
          courseId: '$course._id',
          milestoneId: '$milestone._id',
          moduleId: '$module._id',
        },
        category: { $first: '$category' },
        course: { $first: '$course' },
        milestone: { $first: '$milestone' },
        module: { $first: '$module' },
        isCorrects: { $addToSet: '$isCorrect' },
      },
    },
    // Group by module
    {
      $group: {
        _id: {
          categoryId: '$_id.categoryId',
          courseId: '$_id.courseId',
          milestoneId: '$_id.milestoneId',
        },
        category: { $first: '$category' },
        course: { $first: '$course' },
        milestone: { $first: '$milestone' },
        modules: {
          $push: {
            _id: '$_id.moduleId',
            title: '$module.title',
            isCorrects: '$isCorrects',
          },
        },
      },
    },
    // Group by milestone
    {
      $group: {
        _id: {
          categoryId: '$_id.categoryId',
          courseId: '$_id.courseId',
        },
        category: { $first: '$category' },
        course: { $first: '$course' },
        milestones: {
          $push: {
            _id: '$_id.milestoneId',
            title: '$milestone.title',
            modules: '$modules',
          },
        },
      },
    },
    // Group by category, collecting courses and milestones
    {
      $group: {
        _id: '$_id.categoryId',
        category: { $first: '$category' },
        courses: {
          $push: {
            _id: '$course._id',
            title: '$course.title',
            showing_number: '$course.showing_number',
            milestones: '$milestones',
          },
        },
      },
    },
  ];

  let result = null;
  if (select) {
    result = await QuizSubmit.find({})
      .sort({ title: 1 })
      .select({ ...projection });
  } else {
    result = await QuizSubmit.aggregate(pipeline);
  }

  const total = await QuizSubmit.countDocuments(whereConditions);
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
const getQuizSubmitVerifyFromDb = async (
  id: string,
  user: any,
): Promise<IQuizSubmit[] | null> => {
  const findSubmitQuiz = await QuizSubmit.find({
    quiz: new Types.ObjectId(id as string),
    user: new Types.ObjectId(user.id as string),
  }).populate('singleQuiz');

  return findSubmitQuiz;
};
const getQuizSubmitSingelFromDb = async (
  id: string,
): Promise<IQuizSubmit | null> => {
  const result = await QuizSubmit.aggregate([
    { $match: { _id: new ObjectId(id) } },
  ]);

  return result[0];
};

// delete e form db
const deleteQuizSubmitByIdFromDb = async (
  id: string,
  query: IQuizSubmitFilters,
): Promise<IQuizSubmit | null> => {
  let result;
  // console.log(query, 'query');
  if (query.delete === ENUM_YN.YES) {
    result = await QuizSubmit.findByIdAndDelete(id);
  } else {
    result = await QuizSubmit.findOneAndUpdate(
      { _id: id },
      { status: ENUM_STATUS.DEACTIVATE, isDelete: ENUM_YN.YES },
    );
  }
  return result;
};

export const QuizSubmitService = {
  createQuizSubmitByDb,
  getAllQuizSubmitFromDb,
  getQuizSubmitSingelFromDb,
  deleteQuizSubmitByIdFromDb,
  getQuizSubmitVerifyFromDb,
  getQuizSubmitAnalyticsFromDb,
};
