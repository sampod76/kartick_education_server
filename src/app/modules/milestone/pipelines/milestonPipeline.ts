import { PipelineStage } from 'mongoose';
import { ENUM_YN } from '../../../../enums/globalEnums';

export type IMilestonePipeline = {
  whereConditions: any;
  sortConditions: any;
  skip?: any;
  limit?: any;
};

const moduleList = ({
  whereConditions,
  sortConditions,
  limit,
  skip,
}: IMilestonePipeline) => {
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
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

    // module
    {
      $lookup: {
        from: 'modules',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$milestone', '$$id'] },
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
            },
          },
        ],
        as: 'modules',
      },
    },
  ];
  return pipeline;
};

const onlyMilestone = ({
  whereConditions,
  sortConditions,
  limit,
  skip,
}: IMilestonePipeline) => {
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
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
  return pipeline;
};

export const milestonePipeline = {
  moduleList,
  onlyMilestone,
};
