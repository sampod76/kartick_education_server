import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

import {
  IUserLoginHistory,
  UserLoginHistoryModel,
} from './loginHistory.interface';

export const UserLoginHistorySchema = new Schema<
  IUserLoginHistory,
  UserLoginHistoryModel
>(
  {
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
    },
    user_agent: {
      type: String,
    },
    ip: {
      type: String,
    },
    time: {
      type: String,
    },
    token: {
      type: String,
    },
    device_info: {
      os: {
        type:Object,
        default: {},
      },
      client: {
        type:Object,
        default: {},
      },
      device: {
        type:Object,
      },
      default: {},
    },
    // device_info: {
    //   os: {
    //     type: {
    //       name: String,
    //       short_name: String,
    //       version: String,
    //       platform: String,
    //       family: String,
    //     },
    //     default: {},
    //   },
    //   client: {
    //     type: {
    //       type: String,
    //       name: String,
    //       short_name: String,
    //       version: String,
    //       engine: String,
    //       engine_version: String,
    //       family: String,
    //     },
    //     default: {},
    //   },
    //   device: {
    //     type: {
    //       id: String,
    //       type: String,
    //       brand: String,
    //       model: String,
    //       code: String,
    //     },
    //   },
    //   default: {},
    // },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isDelete: {
      type: String,
      default: 'no',
      enum: ['yes', 'no'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const UserLoginHistory = model<IUserLoginHistory, UserLoginHistoryModel>(
  'UserLoginHistory',
  UserLoginHistorySchema,
);
