"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNullAndUndefined = void 0;
const removeNullAndUndefined = (obj) => {
    for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
        else if (typeof obj[key] === 'object') {
            // Recursively remove null and undefined values from nested objects
            (0, exports.removeNullAndUndefined)(obj[key]);
            // After recursion, check if the current object is empty
            if (Object.keys(obj[key]).length === 0) {
                delete obj[key];
            }
        }
    }
};
exports.removeNullAndUndefined = removeNullAndUndefined;
