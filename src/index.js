import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import { connectDB } from "./utils/db.js";
import authRouter from "./routes/auth.route.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v2/auth", authRouter);

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
  connectDB();
});
