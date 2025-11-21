import { ITokenPayload } from '../interfaces';

export * from './authentication';
export * from './verify-token';

// Extend Express Request interface using module augmentation
declare module 'express-serve-static-core' {
  interface Request {
    user: ITokenPayload;
  }
}
