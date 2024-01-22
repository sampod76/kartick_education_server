import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { QUIZ_SEARCHABLE_FIELDS } from './quiz.constant';
import { IQuiz, IQuizFilters } from './quiz.interface';
import { Quiz } from './quiz.model';

const { ObjectId } = mongoose.Types;
const createQuizByDb = async (payload: IQuiz): Promise<IQuiz> => {
  const result = await Quiz.create(payload);
  return result;
};

//getAllQuizFromDb
const getAllQuizFromDb = async (
  filters: IQuizFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IQuiz[]>> => {
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
      $or: QUIZ_SEARCHABLE_FIELDS.map(field =>
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
    {
      $lookup: {
        from: 'modules',
        let: { id: '$module' },
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
              module_number: 1,
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

  let result = null;
  if (select) {
    result = await Quiz.find({})
      .sort({ title: 1 })
      .select({ ...projection });
  } else {
    result = await Quiz.aggregate(pipeline);
  }

  const total = await Quiz.countDocuments(whereConditions);
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
const getSingleQuizFromDb = async (id: string): Promise<IQuiz | null> => {
  const result = await Quiz.aggregate([
    { $match: { _id: new ObjectId(id) } },
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
          {
            $lookup: {
              from: 'modules',
              let: { id: '$module' },
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
                {
                  $lookup: {
                    from: 'milestones',
                    let: { id: '$milestone' },
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
                            {
                              $lookup: {
                                from: 'categories',
                                let: { id: '$category' },
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
                                as: 'categoryDetails',
                              },
                            },
                            {
                              $project: { category: 0 },
                            },
                            {
                              $addFields: {
                                category: {
                                  $cond: {
                                    if: {
                                      $eq: [{ $size: '$categoryDetails' }, 0],
                                    },
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

                            //! ///////

                            {
                              $project: {
                                title: 1,
                                category: 1,
                              },
                            },
                          ],
                          as: 'courseDetails',
                        },
                      },
                      {
                        $project: { milestone: 0 },
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

                      //! ////////////////////////

                      {
                        $project: {
                          title: 1,
                          course: 1,
                          milestone_number: 1,
                        },
                      },
                    ],
                    as: 'milestoneDetails',
                  },
                },
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
                  $project: { milestoneDetails: 0 },
                },
                {
                  $unwind: '$milestone',
                },

                {
                  $project: {
                    title: 1,
                    milestone: 1,
                    module_number: 1,
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

          {
            $project: {
              title: 1,
              lesson_number: 1,
              module: 1,
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
  ]);

  return result[0];
};

// update e form db
const updateQuizFromDb = async (
  id: string,
  payload: Partial<IQuiz>,
): Promise<IQuiz | null> => {
  const { demo_video, ...otherData } = payload;
  const updateData = { ...otherData };
  if (demo_video && Object.keys(demo_video).length > 0) {
    Object.keys(demo_video).forEach(key => {
      const demo_videoKey = `demo_video.${key}`; // `demo_video.status`
      (updateData as any)[demo_videoKey] =
        demo_video[key as keyof typeof demo_video];
    });
  }

  const result = await Quiz.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(500, 'Quiz update fail!!😪😭😰');
  }
  return result;
};

// delete e form db
const deleteQuizByIdFromDb = async (
  id: string,
  query: IQuizFilters,
): Promise<IQuiz | null> => {
  let result;
  if (query.delete === ENUM_YN.YES) {
    result = await Quiz.findByIdAndDelete(id);
  } else {
    result = await Quiz.findOneAndUpdate(
      { _id: id },
      { status: ENUM_STATUS.DEACTIVATE, isDelete: ENUM_YN.YES },
    );
  }
  return result;
};

// set user reviews e form db
const QuizReviewsByUserFromDb = async (): Promise<IQuiz | null> => {
  return null;
};

export const QuizService = {
  createQuizByDb,
  getAllQuizFromDb,
  getSingleQuizFromDb,
  updateQuizFromDb,
  deleteQuizByIdFromDb,
  QuizReviewsByUserFromDb,
};
