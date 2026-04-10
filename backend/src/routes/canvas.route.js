import express from "express";
import {
  getAllCanvases,
  createCanvas,
  getCanvas,
  deleteCanvas,
  updateCanvas,
} from "../controllers/canvas.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

// define routes
router.get("/", verifyJWT, getAllCanvases);
router.post("/create-canvas", verifyJWT, createCanvas);
router.get("/load/:canvasId", verifyJWT, getCanvas); // to get a specific canvas by id, we can use the same getCanvas controller and check if canvasId is present in params, if yes then return that canvas only
router.delete("/delete/:canvasId", verifyJWT, deleteCanvas);
router.put("/update", verifyJWT, updateCanvas); // to update a specific canvas by id
export default router;
