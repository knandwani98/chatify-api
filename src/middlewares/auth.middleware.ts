import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
("../types/express.d.ts");

export const protectedRoutes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
      id: string;
    };

    const validUser = await User.findById(decoded.id).select("-password");

    if (!validUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token",
      });
    }

    req.user = validUser;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
