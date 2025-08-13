import { UserResponse } from './user.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserResponse;
    }
  }
}

export {};