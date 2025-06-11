import { IUser } from "../models/user.model";
declare module "express" {
  export interface Request {
    user?: IUser;
  }
  export interface Response {
    user?: IUser;
  }
}
