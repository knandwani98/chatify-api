import { Router } from "express";

import {
  loggedInUser,
  login,
  logout,
  signUp,
} from "../controllers/auth.controller";
import { protectedRoutes } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", signUp);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.get("/verify", protectedRoutes, loggedInUser);

export default authRouter;
