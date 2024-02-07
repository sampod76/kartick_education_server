import { JwtPayload } from 'jsonwebtoken';
type customData = {
  downloadType: any;
};
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user: JwtPayload | null;
      customData: customData | null | undefined;
    }
  }
}
