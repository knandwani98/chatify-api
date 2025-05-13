import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import { connectDB } from "./utils/db.js";
import authRouter from "./routes/auth.route.js";

const PORT = process.env.PORT! || 5000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
  connectDB();
});
