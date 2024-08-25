import { Schema, model } from 'mongoose';
import { HomeVideoUpload } from './HomeVideo.interface';

const homeVideoUplaodSchema: any = new Schema<HomeVideoUpload>({
  title: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  videoURL: {
    type: String,
  },
  videoFileName: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  grade: {
    type: String,
  },
  createdAt: {
    type: Date,
    // default : new Date()
  },
});

export const HomeVideoUploadModel = model<HomeVideoUpload>(
  'homevideoupload',
  homeVideoUplaodSchema,
);
