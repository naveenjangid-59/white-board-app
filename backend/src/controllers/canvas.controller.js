import Canvas from "../models/canvas.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllCanvases = async (req, res) => {
  try {
    const email = req.user.email;
    const canvases = await Canvas.getAllCanvases(email);
    return res
      .status(200)
      .json(new ApiResponse(200, canvases, "Canvases fetched successfully"));
  } catch (error) {
    console.error("Error fetching canvases:", error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Error fetching canvases",
        ),
      );
  }
};

const createCanvas = async (req, res) => {
  try {
    const { name } = req.body;
    const ownerId = req.user._id;

    if (!name) {
      throw new ApiError(400, "Canvas name is required");
    }

    const canvas = await Canvas.createCanvas(name, ownerId);
    return res
      .status(201)
      .json(new ApiResponse(201, canvas, "Canvas created successfully"));
  } catch (error) {
    console.error("Error creating canvas:", error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Error creating canvas",
        ),
      );
  }
};

export { getAllCanvases, createCanvas };
