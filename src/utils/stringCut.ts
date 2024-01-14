import ApiError from '../app/errors/ApiError';

export default function StringCut(
  data: string,
  firstSlice?: number,
  lastSlice?: number
) {
  if (typeof data !== 'string') {
    throw new ApiError(500, 'Invalid string format');
  }
  if (firstSlice) {
    data = data.slice(firstSlice); // Remove first 5 characters
  } else if (lastSlice) {
    data = data.slice(0, -lastSlice); // Remove last 5 characters
  } else {
    return data;
  }

  return data;
}
