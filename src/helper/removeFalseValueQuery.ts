export const removeFalseValue = (obj: any) => {
    const falseValues = [undefined, '', 'undefined', null, 'null'];
    for (const key in obj) {
      if (falseValues.includes(obj[key])) {
        delete obj[key];
      }
    }
  };