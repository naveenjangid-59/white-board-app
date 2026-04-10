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

const getCanvas = async (req, res) => {
  try {
    const { canvasId } = req.params;
    const userId = req.user._id;

    const canvas = await Canvas.getCanvas(canvasId, userId);
    if (!canvas) {
      throw new ApiError(404, "Canvas not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, canvas, "Canvas fetched successfully"));
  } catch (error) {
    console.error("Error fetching canvas:", error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Error fetching canvas",
        ),
      );
  }
};

const deleteCanvas = async (req, res) => {
  try {
    const canvasId = req.params.canvasId;
    const userId = req.user._id;
    const isDeleted = await Canvas.deleteCanvas(canvasId, userId);
    if (!isDeleted) {
      return res
        .status(404)
        .json(new ApiError(404, "Canvas not found or access denied"));
    }
    res.json(new ApiResponse(200, null, "Canvas deleted successfully"));
  } catch (error) {
    console.error("Error deleting canvas:", error);
    res.status(500).json(new ApiError(500, "Error deleting canvas"));
  }
};

const updateCanvas = async (req, res) => {
  try {
    const { canvasId, elements } = req.body;
    const userId = req.user._id;

    if (!canvasId) {
      throw new ApiError(400, "Canvas ID is required");
    }

    const updatedCanvas = await Canvas.updateCanvas(canvasId, userId, elements);

    return res
      .status(200)
      .json(new ApiResponse(200, updatedCanvas, "Canvas updated successfully"));
  } catch (error) {
    console.error("Error updating canvas:", error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Error updating canvas",
        ),
      );
  }
};

export { getAllCanvases, createCanvas, getCanvas, deleteCanvas, updateCanvas };
