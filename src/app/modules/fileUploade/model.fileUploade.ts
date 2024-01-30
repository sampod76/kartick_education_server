import { Schema, Types, model } from 'mongoose';
import { FileUploadeModel, IFileUploade } from './interface.fileUploade';

const FileUploadeSchema = new Schema<IFileUploade, FileUploadeModel>(
  {
    asset_id: { type: String },
    public_id: { type: String },
    version: { type: Number },
    version_id: { type: String },
    signature: { type: String },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    resource_type: { type: String },
    created_at: { type: String },
    tags: { type: [String] },
    bytes: { type: Number },
    type: { type: String },
    etag: { type: String },
    placeholder: { type: Boolean },
    url: { type: String },
    secure_url: { type: String },
    folder: { type: String },
    original_filename: { type: String },
    original_extension: { type: String },
    api_key: { type: String },
    user: { type: Types.ObjectId, ref: 'User' },
    category: { type: String },
    fileType: { type:String}
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  },
);

// s

export const FileUploade = model<IFileUploade, FileUploadeModel>(
  'FileUploade',
  FileUploadeSchema,
);
