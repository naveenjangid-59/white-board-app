import express from "express";
import {
  register,
  login,
  profile,
  refreshAccessToken,
  logout,
} from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

// define routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyJWT, profile);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyJWT, logout);

export default router;
