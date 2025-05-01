import mongoose, { connect } from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log(`MongoDB connected successfully`);
      })
      .catch(() => {
        console.log("MongoDB connection failed");
      });
  } catch (error) {
    console.log("DB connection failed", error);
    process.exit(1);
  }
};
