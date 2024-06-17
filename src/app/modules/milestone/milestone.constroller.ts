import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { MILESTONE_FILTERABLE_FIELDS } from './milestone.constant';
import { IMilestone } from './milestone.interface';
import { MilestoneService } from './milestone.service';

// import { z } from 'zod'
const createMilestone = catchAsync(async (req: Request, res: Response) => {
  if (req?.user?.id) {
    req.body.author = req.user.id;
  }
  const result = await MilestoneService.createMilestoneByDb(req.body);

  sendResponse<IMilestone>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create  Milestone',
    data: result,
  });
});

const getAllMilestone = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  const queryObject = req.query;

  const filters = pick(queryObject, MILESTONE_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await MilestoneService.getAllMilestoneFromDb(
    filters,
    paginationOptions,
  );

  sendResponse<IMilestone[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get  Milestone',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleMilestone = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MilestoneService.getSingleMilestoneFromDb(id);
  sendResponse<IMilestone>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  Milestone',
    data: result,
  });
});
const updateMilestone = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await MilestoneService.updateMilestoneFromDb(id, updateData);

  sendResponse<IMilestone>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update  Milestone',
    data: result,
  });
});

const deleteMilestone = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MilestoneService.deleteMilestoneByIdFromDb(
    id,
    req.query,
  );
  sendResponse<IMilestone>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete  Milestone',
    data: result,
  });
});

const MilestoneReviewsByUser = catchAsync(
  async (req: Request, res: Response) => {
    // const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await MilestoneService.MilestoneReviewsByUserFromDb();

    sendResponse<IMilestone>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull update reviews',
      data: result,
    });
  },
);
export const MilestoneController = {
  createMilestone,
  getAllMilestone,
  getSingleMilestone,
  updateMilestone,
  deleteMilestone,
  MilestoneReviewsByUser,
};
