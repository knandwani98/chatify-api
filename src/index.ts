import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route";
import { connectDB } from "./utils/db";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) });

console.log(process.env.NODE_ENV, "NODE_ENV");

const PORT = process.env.PORT! || 6000;

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
