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
  fileType?: 'image' | 'video' | 'audio' | 'pdf' | 'doc';
  path?: string;
  server_url?: string;
  size?: number;
};
export type IFileUploade = IFileUploadeExta & Partial<ICloudinaryResponse>;
export type FileUploadeModel = Model<IFileUploade, Record<string, unknown>>;
