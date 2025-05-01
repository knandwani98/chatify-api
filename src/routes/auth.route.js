import { Router } from "express";
import {
  signUp,
  login,
  logout,
  loggedInUser,
} from "../controllers/auth.controller.js";
import { protectedRoutes } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", signUp);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.get("/me", protectedRoutes, loggedInUser);

export default authRouter;
