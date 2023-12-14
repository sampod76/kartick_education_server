
      import { Request, Response } from 'express';
      import httpStatus from 'http-status';
      import { PAGINATION_FIELDS } from '../../../constant/pagination';
      
      import catchAsync from '../../share/catchAsync';
      import pick from '../../share/pick';
      import sendResponse from '../../share/sendResponse';

      const createMilestone = catchAsync(async (req: Request, res: Response) => {
        const { ...MilestoneData } = req.body;
      
        const result = await MilestoneService.createMilestoneByDb(MilestoneData);
      
        sendResponse<IMilestone>(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: 'successfully create academic Milestone',
          data: result,
        });
      });
      export const MilestoneController = {
        createMilestone,
        getAllMilestone,
        getSingleMilestone,
        updateMilestone,
        deleteMilestone,
        MilestoneReviewsByUser,
      };
