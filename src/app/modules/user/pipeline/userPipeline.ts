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

    {
      $facet: {
        studentInfo: [
          {
            $match: {
              role: 'student',
            },
          },
          {
            $lookup: {
              from: 'students',
              localField: 'student',
              foreignField: '_id',
              as: 'roleInfo',
            },
          },
        ],
        adminInfo: [
          {
            $match: {
              role: 'admin',
            },
          },
          {
            $lookup: {
              from: 'admins',
              localField: 'admin',
              foreignField: '_id',
              as: 'roleInfo',
            },
          },
        ],
        trainerInfo: [
          {
            $match: {
              role: 'trainer',
            },
          },
          {
            $lookup: {
              from: 'trainers',
              localField: 'trainer',
              foreignField: '_id',
              as: 'roleInfo',
            },
          },
        ],
        // Add more facets for each role you want to include
        // ...
      },
    },
    {
      $project: {
        userData: {
          $concatArrays: ['$studentInfo', '$adminInfo', '$trainerInfo'], // Concatenate arrays into a single array
        },
      },
    },
    {
      $unwind: '$userData', // Unwind the array to separate documents
    },
    {
      $replaceRoot: { newRoot: '$userData' }, // Replace the root with the documents from the array
    },
     // it is must be dabble user included because use $facet is all add group in the role
    { $sort: sortConditions },
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
              $expr: { $eq: ['$_id', '$$id'] },
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
              $expr: { $eq: ['$_id', '$$id'] },
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
