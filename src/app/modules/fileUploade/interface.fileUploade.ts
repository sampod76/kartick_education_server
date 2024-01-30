import { Model } from 'mongoose';
// import { IAdmin } from '../admin/admin.interface';
// import { IGeneralUser } from '../generalUser/interface.GeneralUser';
import { ICloudinaryResponse } from '../../interface/fileUpload';

export type IFileUploadeFilters = {
  searchTerm?: string;
  original_filename?: string;
  category?: string;
  user?: string;
  tag?: string;
};

export type IFileUploadeExta = {
  user?: string /* | IAdmin | IGeneralUser; */;
  category?: string;
  fileType?: string;
};
export type IFileUploade = IFileUploadeExta & ICloudinaryResponse;
export type FileUploadeModel = Model<IFileUploade, Record<string, unknown>>;
