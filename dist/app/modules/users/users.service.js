"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importStar(require("mongoose"));
const users_1 = require("../../../enums/users");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const admin_model_1 = require("../admin/admin.model");
const model_GeneralUser_1 = require("../generalUser/model.GeneralUser");
const moderator_model_1 = require("../moderator/moderator.model");
const users_model_1 = require("./users.model");
const createGeneralUserFromdb = (generalUser, user) => __awaiter(void 0, void 0, void 0, function* () {
    //auto generate user id
    user.role = users_1.ENUM_USER_ROLE.GENERAL_USER;
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //array
        const newGeneralUser = yield model_GeneralUser_1.GeneralUser.create([generalUser], {
            session,
        });
        if (!newGeneralUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create GeneralUser');
        }
        //set GeneralUser -->  _id into user.GeneralUser
        user.generalUser = new mongoose_1.Types.ObjectId(newGeneralUser[0]._id);
        const newUser = yield users_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        newUserAllData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserAllData) {
        newUserAllData = yield users_model_1.User.findOne({ _id: newUserAllData._id }).populate({
            path: 'generalUser',
            populate: [],
        });
    }
    return newUserAllData;
});
const createAdminFromDb = (admin, user) => __awaiter(void 0, void 0, void 0, function* () {
    user.role = users_1.ENUM_USER_ROLE.ADMIN;
    //Generater admin id
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newAdmin = yield admin_model_1.Admin.create([admin], { session });
        if (!newAdmin.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
        }
        //user to ref admin id
        user.admin = newAdmin[0]._id;
        const newUser = yield users_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
        }
        newUserAllData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserAllData) {
        newUserAllData = yield users_model_1.User.findOne({ _id: newUserAllData._id }).populate({
            path: 'admin',
            populate: [],
        });
    }
    return newUserAllData;
});
const createModeratorFromDb = (moderator, user) => __awaiter(void 0, void 0, void 0, function* () {
    // set role
    user.role = users_1.ENUM_USER_ROLE.MODERATOR;
    // generate Moderator id
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newModerator = yield moderator_model_1.Moderator.create([moderator], { session });
        if (!newModerator.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Moderator ');
        }
        user.moderator = newModerator[0]._id;
        const newUser = yield users_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Moderator');
        }
        newUserAllData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserAllData) {
        newUserAllData = yield users_model_1.User.findOne({ _id: newUserAllData._id }).populate('moderator');
    }
    // console.log(newUserAllData);
    return newUserAllData;
});
exports.UserServices = {
    createGeneralUserFromdb,
    createAdminFromDb,
    createModeratorFromDb,
};
/* if (newUserAllData) {
  newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
    path: 'GeneralUser',
    populate: [
      {
        path: 'academicSemester',
        model: 'academic_semester',
      },
      {
        path: 'academicDepartment',
        model: 'academic_Department',
      },
      {
        path: 'academicModerator',
        model: 'academic_Moderator',
      },
    ],
  });
} */
