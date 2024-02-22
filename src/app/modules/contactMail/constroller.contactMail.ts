import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';

import { ContactMail_FILTERABLE_FIELDS } from './consent.contactMail';
import { IContactMail } from './interface.contactMail';
import { ContactMailService } from './service.contactMail';

// import { z } from 'zod'
const createContactMail = catchAsync(async (req: Request, res: Response) => {
  const { ...ContactMailData } = req.body;
  const result = await ContactMailService.createContactMailByDb(ContactMailData);

  sendResponse<IContactMail>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create ContactMail ContactMail',
    data: result,
  });
  // next();
  /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create ContactMail ContactMail',
    }); */
});

const getAllContactMail = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  let queryObject = req.query;
  queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value))
  );
  const filters = pick(queryObject, ContactMail_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await ContactMailService.getAllContactMailFromDb(
    filters,
    paginationOptions
  );

  sendResponse<IContactMail[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get ContactMail ContactMail',
    meta: result.meta,
    data: result.data,
  });
  // next();
});
const getAllContactMailChildrenTitle = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    let queryObject = req.query;
    queryObject = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(queryObject).filter(([_, value]) => Boolean(value))
    );
    const filters = pick(queryObject, ContactMail_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result = await ContactMailService.getAllContactMailChildrenTitleFromDb(
      filters,
      paginationOptions
    );

    sendResponse<IContactMail[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get ContactMail ContactMail',
      meta: result.meta,
      data: result.data,
    });
    // next();
  }
);

const getSingleContactMail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await ContactMailService.getSingleContactMailFromDb(id);

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<IContactMail>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get ContactMail ContactMail',
    data: result,
  });
});
const updateContactMail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await ContactMailService.updateContactMailFromDb(id, updateData);

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<IContactMail>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update ContactMail ContactMail',
    data: result,
  });
});

const deleteContactMail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ContactMailService.deleteContactMailByIdFromDb(id);
  sendResponse<IContactMail>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete ContactMail ContactMail',
    data: result,
  });
});
export const ContactMailController = {
  createContactMail,
  getAllContactMail,
  getSingleContactMail,
  updateContactMail,
  deleteContactMail,
  getAllContactMailChildrenTitle,
};
