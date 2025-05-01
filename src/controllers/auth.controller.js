import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const signUp = async (req, res) => {
  try {
    const { username, fullname, password } = req.body;

    if (!username.trim() || !fullname.trim() || !password.trim()) {
      return res.status(400).send({ message: "All fields are required" });
    }

    if (username.length < 3) {
      return res.status(400).send({
        success: false,
        message: "Username must be at least 3 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already existed",
      });
    }

    const newUser = await User.create({ username, fullname, password });
    const newUserObj = newUser.toObject();
    delete newUserObj.password;

    return res.status(201).send({
      success: true,
      message: "User created successfully",
      data: newUserObj,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isVerified = await user.verifyPassword(password);

    const newUserObj = user.toObject();
    delete newUserObj.password;

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      data: newUserObj,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies?.token || null;

  try {
    if (!token) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "User logout successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const loggedInUser = (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};
