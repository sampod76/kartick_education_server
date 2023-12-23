import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { PAGINATION_FIELDS } from '../../../constant/pagination';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { TrainerService } from './trainer.service';
import { trainerFilterableFields } from './trainer.constant';
import { ITrainer } from './trainer.interface';

const getAllTrainers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, trainerFilterableFields);
  const paginationOptions = pick(req.query, PAGINATION_FIELDS);

  const result = await TrainerService.getAllTrainersDB(filters, paginationOptions);

  sendResponse<ITrainer[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trainers retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTrainer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TrainerService.getSingleTrainerDB(id);

  sendResponse<ITrainer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trainer retrieved successfully !',
    data: result,
  });
});

const updateTrainer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await TrainerService.updateTrainerDB(id, updatedData);

  sendResponse<ITrainer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trainer updated successfully !',
    data: result,
  });
});
const deleteTrainer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TrainerService.deleteTrainerDB(id,req.query);

  sendResponse<ITrainer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trainer deleted successfully !',
    data: result,
  });
});

export const TrainerController = {
  getAllTrainers,
  getSingleTrainer,
  updateTrainer,
  deleteTrainer,
};
