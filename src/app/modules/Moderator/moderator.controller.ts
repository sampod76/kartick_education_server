
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import { ModeratorFilterableFields } from './moderator.constant';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
import { ModeratorService } from './moderator.service';
import sendResponse from '../../share/sendResponse';
import { IModerator } from './moderator.interface';


const getAllModerators = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ModeratorFilterableFields);
  const paginationOptions = pick(req.query, PAGINATION_FIELDS);

  const result = await ModeratorService.getAllModeratorsDB(
    filters,
    paginationOptions
  );

  sendResponse<IModerator[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'faculties retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleModerator = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ModeratorService.getSingleModeratorDB(id);

  sendResponse<IModerator>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Moderator retrieved successfully !',
    data: result,
  });
});

const updateModerator = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await ModeratorService.updateModeratorDB(id, updatedData);

  sendResponse<IModerator>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Moderator updated successfully !',
    data: result,
  });
});

const deleteModerator = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ModeratorService.deleteModeratorDB(id);

  sendResponse<IModerator>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Moderator deleted successfully !',
    data: result,
  });
});

export const ModeratorController = {
 getAllModerators,
  getSingleModerator,
  updateModerator,
  deleteModerator,
};
