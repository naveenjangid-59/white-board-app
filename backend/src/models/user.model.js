import mongoose, { Schema } from "mongoose";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

// 1. define user schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      // we provide index for fields , on which we are going to perform search operations frequently, it will improve the performance of search queries on that field
      // although unique: true also provide indexing automatically
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // In your User Schema:
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  },
);

// defining static methods for db interactions
userSchema.statics.createUser = async function (username, email, password) {
  try {
    const user = await this.create({ username, email, password });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new ApiError(500, "Error creating user");
  }
};

userSchema.statics.getUserByEmail = async function (email) {
  try {
    const user = await this.findOne({ email });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new ApiError(500, "Error fetching user by email");
  }
};

userSchema.statics.updateUserEmail = async function (username, email) {
  try {
    const newEmail = email;
    const user = await this.findOneAndUpdate(
      { username },
      { email: newEmail },
      { returnDocument: "after" }, // return updated doc, not old one
    );
    console.log("Updated user:", user);
    return user;
  } catch (error) {
    console.error("Error updating user email:", error);
    throw error;
  }
};

userSchema.statics.deleteUserByUsername = async function (username) {
  try {
    const result = await this.deleteOne({ username });
    return result.deletedCount > 0; // return true if a user was deleted
  } catch (error) {
    console.error("Error deleting user by username:", error);
    throw error;
  }
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    },
  );
};

// methods are used for instance methods, which can be called on individual document instances, like user.generateAccessToken()
// statics are used for static methods, which can be called on the model itself, like User.createUser()

// 2. create user model
const User = mongoose.model("User", userSchema);

// 3. export user model
export default User;
