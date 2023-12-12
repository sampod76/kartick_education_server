// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CryptoJS from 'crypto-js';
export const encryptCryptoData = <T>(data: T | any, key: string): string => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key);
  return encrypted.toString();
};

export const decryptCryptoData = (data: string, key: string): any => {
  const bytes = CryptoJS.AES.decrypt(data, key);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
};
