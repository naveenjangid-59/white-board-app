import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validate input presence
    if (!username?.trim() || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    // validate email
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    // validate password strength
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
    ) {
      throw new ApiError(400, "Password must be at least 8 characters long");
    }

    // check if user exists
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS),
    );

    // create user
    const user = await User.createUser(username, email, hashedPassword);

    // remove sensitive data
    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    // send response
    return res
      .status(201)
      .json(new ApiResponse(201, safeUser, "User registered successfully"));
  } catch (error) {
    console.error("Register error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Registration failed",
      statusCode: error.statusCode || 500,
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    if (!password || !password.trim()) {
      throw new ApiError(400, "Password is required");
    }

    const user = await User.getUserByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const options = {
      httpOnly: true, // Accessible only by the web server (not by JavaScript)
      secure: true, // Only send the cookie over HTTPS
    };

    const safeUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: safeUser,
            refreshToken,
            accessToken,
          },
          "user logged in successfully",
        ),
      );
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Login failed",
      statusCode: error.statusCode || 500,
      success: false,
    });
  }
};

const profile = async (req, res) => {
  const user = req.user; // set by auth middleware

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "No refresh token provided");
    }

    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const userId = decoded._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (!user.refreshToken || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token mismatch");
    }

    const newAccessToken = user.generateAccessToken();

    const newRefreshToken = user.generateRefreshToken();
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    // send new tokens
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, {}, "Access token refreshed successfully"));
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "RefreshTokenExpired",
        customMessage: "refresh token has expired, please log in again",
        success: false,
      });
    }
    return res.status(401).json({
      message: error.message || "Invalid refresh token",
      customMessage: "general error in refresh token",
      success: false,
    });
  }
};

const logout = async (req, res) => {
  try {
    const user = req.user;

    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Logout failed", false));
  }
};

export { register, login, profile, refreshAccessToken, logout };
