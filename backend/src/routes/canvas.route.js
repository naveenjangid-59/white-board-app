import express from "express";
import {
  getAllCanvases,
  createCanvas,
} from "../controllers/canvas.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

// define routes
router.get("/", verifyJWT, getAllCanvases);
router.post("/create-canvas", verifyJWT, createCanvas);

export default router;
