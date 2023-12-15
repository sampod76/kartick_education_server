
      import mongoose, { PipelineStage, Types } from 'mongoose';

      import { paginationHelper } from '../../../helper/paginationHelper';
      
      import { IGenericResponse } from '../../interface/common';
      import { IPaginationOption } from '../../interface/pagination';
      
      import ApiError from '../../errors/ApiError';
      const { ObjectId } = mongoose.Types;

      const createMilestoneByDb = async (payload: IMilestone):Promise<IMilestone> => {
        const milestone = new Milestone(payload);
        return await milestone.save();
      } 


export const MilestoneService = {
  createMilestoneByDb,
  getAllMilestoneFromDb,
  getSingleMilestoneFromDb,
  updateMilestoneFromDb,
  deleteMilestoneByIdFromDb,

};
