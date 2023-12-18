"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COURSE_STATUS = exports.COURSE_TYPES = exports.COURSE_FILTERABLE_FIELDS = exports.COURSE_SEARCHABLE_FIELDS = void 0;
exports.COURSE_SEARCHABLE_FIELDS = [
    'title',
    'details',
    'snid'
];
exports.COURSE_FILTERABLE_FIELDS = [
    'searchTerm',
    'price',
    'duration',
    'level',
    'status',
    'price_type',
];
exports.COURSE_TYPES = ['free', 'paid', 'open', 'closed', 'recurrig'];
exports.COURSE_STATUS = ['active', 'deactivate', 'save'];
