import { NextFunction, Request, Response } from 'express';
import config from '../../config';
import { decryptCryptoData } from '../../utils/cryptoEncryptDecrypt';
const decryptMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const decryptedData = decryptCryptoData(
        //! important notice decryptData is a valide object but front end to send json object so front end to send json object {data:"encryptedcode"}
        req.body.data,
        config.crypto_key as string
      );
      
      req.body = decryptedData;
      next()
    } catch (error) {
      next(error);
    }
  };

export default decryptMiddleware;
