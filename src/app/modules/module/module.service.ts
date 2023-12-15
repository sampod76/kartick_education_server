
      import mongoose, { PipelineStage, Types } from 'mongoose';

      import { paginationHelper } from '../../../helper/paginationHelper';
      
      import { IGenericResponse } from '../../interface/common';
      import { IPaginationOption } from '../../interface/pagination';
      
      import ApiError from '../../errors/ApiError';
      const { ObjectId } = mongoose.Types;

      const createModuleByDb = async (payload: IModule):Promise<IModule> => {
        const module = new Module(payload);
        return await module.save();
      } 


export const ModuleService = {
  createModuleByDb,
  getAllModuleFromDb,
  getSingleModuleFromDb,
  updateModuleFromDb,
  deleteModuleByIdFromDb,

};
