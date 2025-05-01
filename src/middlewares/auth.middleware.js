import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoutes = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
