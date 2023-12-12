"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COURSE_MODES = exports.COURSE_TYPES = exports.COURSE_FILTERABLE_FIELDS = exports.COURSE_SEARCHABLE_FIELDS = void 0;
exports.COURSE_SEARCHABLE_FIELDS = [
    'title',
    'publisherName',
    'tag',
    'courseId',
];
exports.COURSE_FILTERABLE_FIELDS = [
    'searchTerm',
    'price',
    'status',
    'publisher',
    'date',
    'categoryDetails.category',
    'reviews.star',
    'select',
    'course_mode',
];
exports.COURSE_TYPES = ['free', 'paid', 'open', 'closed', 'recurrig'];
exports.COURSE_MODES = ['pre_recorded', 'jobs', 'events'];
