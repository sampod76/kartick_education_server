import jwt from 'jsonwebtoken';
import ApiError from '../app/errors/ApiError';

export const encrypt = (obj: object): string => {
  const encrypted = jwt.sign(obj, process.env.ENCRYPTION_SECRET as string);
  return encrypted;
};

export const decrypt = (encryptedText: string): any => {
  try {
    const obj = jwt.verify(
    encryptedText,
    process.env.ENCRYPTION_SECRET as string
  );
  return obj;
  } catch (error) {
    throw new ApiError(400,"failed to verify")
  }
};

