import { PipelineStage } from 'mongoose';

export type IMilestonePipeline = {
  whereConditions: any;
  sortConditions: any;
  skip?: any;
  limit?: any;
};

const allUser = ({
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

    //admin
    {
      $lookup: {
        from: 'admins',
        let: { id: '$admin' },
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
    //মনে রাখতে হবে যদি এটি দেওয়া না হয় তাহলে সে যখন কোন একটি ক্যাটাগরির থাম্বেল না পাবে সে তাকে দেবে না
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

    {
      $lookup: {
        from: 'trainers',
        let: { id: '$trainer' },
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
      $project: { password: 0 },
    },

    //
    {
      $lookup: {
        from: 'students',
        let: { id: '$student' },
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

          {
            $project: {
              password: 0,
              __v: 0,
            },
          },
        ],
        as: 'studentDetails',
      },
    },
    {
      $project: { student: 0 },
    },
    {
      $addFields: {
        student: {
          $cond: {
            if: { $eq: [{ $size: '$studentDetails' }, 0] },
            then: [{}],
            else: '$studentDetails',
          },
        },
      },
    },
    {
      $project: { studentDetails: 0 },
    },
    {
      $unwind: '$student',
    },
    {
      $project: { password: 0 },
    },
  ];
  return pipeline;
};

const author = ({
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
    //admin
    {
      $lookup: {
        from: 'admins',
        let: { id: '$admin' },
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
    //মনে রাখতে হবে যদি এটি দেওয়া না হয় তাহলে সে যখন কোন একটি ক্যাটাগরির থাম্বেল না পাবে সে তাকে দেবে না
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

    {
      $lookup: {
        from: 'trainers',
        let: { id: '$trainer' },
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
      $project: { password: 0 },
    },
  ];
  return pipeline;
};

export const userPipeline = {
  allUser,
  author,
};
