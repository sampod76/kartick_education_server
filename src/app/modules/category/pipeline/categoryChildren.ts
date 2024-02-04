import { PipelineStage } from 'mongoose';
import { ENUM_YN } from '../../../../enums/globalEnums';

export type IMilestonePipeline = {
  whereConditions: any;
  sortConditions: any;
  skip?: any;
  limit?: any;
};

const all = ({ whereConditions, sortConditions }: IMilestonePipeline) => {
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },

    {
      $lookup: {
        from: 'courses',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$category', '$$id'] },

                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ], // The condition to match the fields
              },
            },
          },
          { $sort: { title: 1 } },
          // Additional stages for collection2
          {
            $lookup: {
              from: 'milestones',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$course', '$$id'] },
                        { $eq: ['$isDelete', ENUM_YN.NO] },
                      ], // The condition to match the fields
                    },
                  },
                },
                { $sort: { milestone_number: 1 } },
                // Additional stages for collection2
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
                            ], // The condition to match the fields
                          },
                        },
                      },
                      { $sort: { module_number: 1 } },
                      // Additional stages for collection2
                      {
                        $lookup: {
                          from: 'lessons',
                          let: { id: '$_id' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ['$module', '$$id'] },
                                    { $eq: ['$isDelete', ENUM_YN.NO] },
                                  ], // The condition to match the fields
                                },
                              },
                            },
                            { $sort: { lesson_number: 1 } },
                            // Additional stages for collection2
                            {
                              $lookup: {
                                from: 'quizzes',
                                let: { id: '$_id' },
                                pipeline: [
                                  {
                                    $match: {
                                      $expr: {
                                        $and: [
                                          { $eq: ['$lesson', '$$id'] },
                                          { $eq: ['$isDelete', ENUM_YN.NO] },
                                        ], // The condition to match the fields
                                      },
                                    },
                                  },
                                  // Additional stages for collection2

                                  {
                                    $project: {
                                      title: 1,
                                      img: 1,
                                    },
                                  },
                                ],
                                as: 'quizzes',
                              },
                            },
                            {
                              $project: {
                                title: 1,
                                lesson_number: 1,
                                img: 1,
                                quizzes: 1,
                              },
                            },
                          ],
                          as: 'lessons',
                        },
                      },
                      {
                        $project: {
                          title: 1,
                          img: 1,
                          lessons: 1,
                          module_number: 1,
                        },
                      },
                    ],
                    as: 'modules',
                  },
                },

                {
                  $project: {
                    title: 1,
                    img: 1,
                    milestone_number: 1,
                    modules: 1,
                  },
                },
              ],
              as: 'milestones',
            },
          },

          {
            $project: {
              title: 1,
              img: 1,
              snid: 1,
              milestones: 1,
            },
          },
        ],
        as: 'courses',
      },
    },
    // { $limit: Number(limit) || 15 },
  ];
  return pipeline;
};

const categoryCourseMilestonModuleLesson = ({
  whereConditions,
  sortConditions,
}: IMilestonePipeline) => {
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },

    {
      $lookup: {
        from: 'courses',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$category', '$$id'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ], // The condition to match the fields
              },
            },
          },
          { $sort: { title: 1 } },
          // Additional stages for collection2
          {
            $lookup: {
              from: 'milestones',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$course', '$$id'] },
                        { $eq: ['$isDelete', ENUM_YN.NO] },
                      ], // The condition to match the fields
                    },
                  },
                },
                { $sort: { milestone_number: 1 } },
                // Additional stages for collection2
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
                            ], // The condition to match the fields
                          },
                        },
                      },
                      { $sort: { module_number: 1 } },
                      // Additional stages for collection2
                      {
                        $lookup: {
                          from: 'lessons',
                          let: { id: '$_id' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ['$module', '$$id'] },
                                    { $eq: ['$isDelete', ENUM_YN.NO] },
                                  ], // The condition to match the fields
                                },
                              },
                            },
                            { $sort: { lesson_number: 1 } },
                            // Additional stages for collection2

                            {
                              $project: {
                                title: 1,
                                lesson_number: 1,
                                img: 1,
                              },
                            },
                          ],
                          as: 'lessons',
                        },
                      },
                      {
                        $project: {
                          title: 1,
                          img: 1,
                          lessons: 1,
                          module_number: 1,
                        },
                      },
                    ],
                    as: 'modules',
                  },
                },

                {
                  $project: {
                    title: 1,
                    img: 1,
                    milestone_number: 1,
                    modules: 1,
                  },
                },
              ],
              as: 'milestones',
            },
          },

          {
            $project: {
              title: 1,
              img: 1,
              snid: 1,
              milestones: 1,
            },
          },
        ],
        as: 'courses',
      },
    },
    // { $limit: Number(limit) || 15 },
  ];
  return pipeline;
};
const categoryCourseMilestonModule = ({
  whereConditions,
  sortConditions,
}: IMilestonePipeline) => {
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },

    {
      $lookup: {
        from: 'courses',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$category', '$$id'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ], // The condition to match the fields
              },
            },
          },
          { $sort: { title: 1 } },
          // Additional stages for collection2
          {
            $lookup: {
              from: 'milestones',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$course', '$$id'] },
                        { $eq: ['$isDelete', ENUM_YN.NO] },
                      ], // The condition to match the fields
                    },
                  },
                },
                { $sort: { milestone_number: 1 } },
                // Additional stages for collection2
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
                            ], // The condition to match the fields
                          },
                        },
                      },
                      { $sort: { module_number: 1 } },
                      // Additional stages for collection2

                      {
                        $project: {
                          title: 1,
                          img: 1,

                          module_number: 1,
                        },
                      },
                    ],
                    as: 'modules',
                  },
                },

                {
                  $project: {
                    title: 1,
                    img: 1,
                    milestone_number: 1,
                    modules: 1,
                  },
                },
              ],
              as: 'milestones',
            },
          },

          {
            $project: {
              title: 1,
              img: 1,
              snid: 1,
              milestones: 1,
            },
          },
        ],
        as: 'courses',
      },
    },
    // { $limit: Number(limit) || 15 },
  ];
  return pipeline;
};

const categoryCourseMileston = ({
  whereConditions,
  sortConditions,
}: IMilestonePipeline) => {
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },

    {
      $lookup: {
        from: 'courses',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$category', '$$id'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ], // The condition to match the fields
              },
            },
          },
          { $sort: { title: 1 } },
          // Additional stages for collection2
          {
            $lookup: {
              from: 'milestones',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$course', '$$id'] },
                        { $eq: ['$isDelete', ENUM_YN.NO] },
                      ], // The condition to match the fields
                    },
                  },
                },
                { $sort: { milestone_number: 1 } },
                // Additional stages for collection2

                {
                  $project: {
                    title: 1,
                    img: 1,
                    milestone_number: 1,
                  },
                },
              ],
              as: 'milestones',
            },
          },

          {
            $project: {
              title: 1,
              img: 1,
              snid: 1,
              milestones: 1,
            },
          },
        ],
        as: 'courses',
      },
    },
    // { $limit: Number(limit) || 15 },
  ];
  return pipeline;
};

const categoryCourse = ({
  whereConditions,
  sortConditions,
}: IMilestonePipeline) => {
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },

    {
      $lookup: {
        from: 'courses',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$category', '$$id'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ], // The condition to match the fields
              },
            },
          },
          { $sort: { title: 1 } },
          // Additional stages for collection2

          {
            $project: {
              title: 1,
              img: 1,
              snid: 1,
            },
          },
        ],
        as: 'courses',
      },
    },
    // { $limit: Number(limit) || 15 },
  ];
  return pipeline;
};

export const categoryPipeline = {
  all,
  categoryCourse,
  categoryCourseMileston,
  categoryCourseMilestonModule,
  categoryCourseMilestonModuleLesson,
};
