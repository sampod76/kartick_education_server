import { PipelineStage } from 'mongoose';

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
              $expr: { $eq: ['$_id', '$$id'] },
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
              $expr: { $eq: ['$milestone', '$$id'] },
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
              $expr: { $eq: ['$_id', '$$id'] },
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

  ];
  return pipeline;
};

export const milestonePipeline = {
    moduleList,onlyMilestone
};
