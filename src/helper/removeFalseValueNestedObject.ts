export const removeNullAndUndefined = (obj: Record<string, any>) => {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      // Recursively remove null and undefined values from nested objects
      removeNullAndUndefined(obj[key]);
      // After recursion, check if the current object is empty
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
};
