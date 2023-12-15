
      import { Request, Response } from 'express';
      import httpStatus from 'http-status';
      import { PAGINATION_FIELDS } from '../../../constant/pagination';
      
      import catchAsync from '../../share/catchAsync';
      import pick from '../../share/pick';
      import sendResponse from '../../share/sendResponse';

      const createModule = catchAsync(async (req: Request, res: Response) => {
        const { ...ModuleData } = req.body;
      
        const result = await ModuleService.createModuleByDb(ModuleData);
      
        sendResponse<IModule>(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: 'successfully create academic Module',
          data: result,
        });
      });
      export const ModuleController = {
        createModule,
        getAllModule,
        getSingleModule,
        updateModule,
        deleteModule,
        ModuleReviewsByUser,
      };
