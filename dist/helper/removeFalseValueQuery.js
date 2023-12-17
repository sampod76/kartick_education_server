"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFalseValue = void 0;
const removeFalseValue = (obj) => {
    const falseValues = [undefined, '', 'undefined', null, 'null'];
    for (const key in obj) {
        if (falseValues.includes(obj[key])) {
            delete obj[key];
        }
    }
};
exports.removeFalseValue = removeFalseValue;
