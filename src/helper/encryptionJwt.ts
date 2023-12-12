import jwt from 'jsonwebtoken';

export const encrypt = (obj: object): string => {
  const encrypted = jwt.sign(obj, process.env.ENCRYPTION_SECRET as string);
  return encrypted;
};

export const decrypt = (encryptedText: string): any => {
  const obj = jwt.verify(
    encryptedText,
    process.env.ENCRYPTION_SECRET as string
  );
  return obj;
};

