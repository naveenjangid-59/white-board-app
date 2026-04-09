import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const verifyJWT = async (req, res, next) => {
  try {
    // get access token from cookies
    const token = req.cookies?.accessToken;
    // console.log("cookies:", req.cookies); // Debugging log
    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    // verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // get user from DB (without sensitive fields)
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }

    // attach user to request
    req.user = user;

    next(); // move to next middleware/controller
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "AccessTokenExpired",
        success: false,
      });
    }
    return res
      .status(401)
      .json(new ApiError(401, "Unauthorized: Invalid token"));
  }
};

export default verifyJWT;
