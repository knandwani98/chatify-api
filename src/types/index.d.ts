import { UserType } from "../models/user.model.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}
