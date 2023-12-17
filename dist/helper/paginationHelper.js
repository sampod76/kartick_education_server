"use strict";
// import { SortOrder } from 'mongoose';
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelper = void 0;
const calculatePagination = (option) => {
    const page = Number(option.page || 1);
    const limit = Number(option.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = option.sortBy || 'createdAt';
    const sortOrder = option.sortOrder || 'desc';
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
exports.paginationHelper = {
    calculatePagination,
};
