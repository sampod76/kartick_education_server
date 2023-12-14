"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const course_consent_1 = require("./course.consent");
// import { format } from 'date-fns';
const courseSchema = new mongoose_1.Schema({
    courseId: {
        type: String,
        unique: true,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    type: {
        type: String,
        enum: course_consent_1.COURSE_TYPES, // ['free', 'paid', 'open', 'closed', 'recurrig'];
    },
    course_mode: {
        type: String,
        // enum: COURSE_MODES, 
    },
    categoryDetails: {
        type: {
            category: {
                type: mongoose_1.Types.ObjectId,
                ref: 'Category',
            },
            title: {
                type: String,
                lowercase: true,
                trim: true,
            },
        },
    },
    discount: {
        type: {
            value: {
                type: Number,
                default: 0,
            },
            startDate: {
                type: Date,
            },
            expiryDate: {
                type: Date,
            },
        },
    },
    vat: {
        type: Number,
        default: 0,
    },
    header_1: String,
    header_2: String,
    description: String,
    // thumbnail: {
    //   type: Types.ObjectId,
    //   ref: 'FileUploade',
    // },
    publish: {
        type: {
            date: {
                type: Date,
                // default: () => {
                //   // Get the current date
                //   const today = new Date();
                //   const dateString = format(today, 'yyyy-MM-dd');
                //   return dateString;
                // },
            },
        },
    },
    // publisher: {
    //   // type: mongoose.Schema.Types.ObjectId,
    //   type: Schema.Types.ObjectId,
    //   ref: 'Moderator',
    //   required: true,
    // },
    publisherName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'deactive', 'save'],
        default: 'active',
    },
    tag: [
        {
            type: String,
            trim: true,
        },
    ],
    // after user
    reviews: [
        {
            userId: {
                type: mongoose_1.Types.ObjectId,
                ref: 'General_user',
            },
            star: {
                type: Number,
                min: 0,
                max: 5,
            },
            message: {
                type: String,
            },
        },
    ],
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
// courseSchema.pre('save', async function (next) {
//   try {
//     if (!this.publish?.date || this.status === 'active') {
//       const today = new Date();
//       const date = format(today, 'yyyy-MM-dd');
//       this.publish?.date = date
//     }
//   } catch (error) {
//     throw new ApiError(404, 'Internal error');
//   }
// });
exports.Course = (0, mongoose_1.model)('Course', courseSchema);
