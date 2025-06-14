import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: string;
  username: string;
  fullname: string;
  profileUrl: string;
  bio: string;
  password: string;
  friends: string[];
  friendRequest: string[];
  verifyPassword: (password: string) => boolean;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    unique: [true, "Username already exists"],
    require: true,
  },
  fullname: {
    type: String,
    require: true,
  },
  profileUrl: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
    maxLength: 150,
  },
  password: {
    type: String,
    require: true,
    minLength: 6,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequest: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(this?.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.verifyPassword = async function (password: string) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password verification failed");
  }
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
