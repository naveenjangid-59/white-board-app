import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "NoAccessToken");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiError(401, "InvalidUser");
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(new ApiError(401, "AccessTokenExpired"));
    }
    return res
      .status(401)
      .json(new ApiError(401, error.message || "Unauthorized"));
  }
};

export default verifyJWT;
