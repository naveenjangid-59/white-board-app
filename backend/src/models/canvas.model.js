import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const canvasSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user who created the canvas
      required: true,
    },
    elements: {
      type: [{ type: mongoose.Schema.Types.Mixed }],
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // users with whom the canvas is shared
      },
    ],
  },
  { timestamps: true },
);
// statics + methods
canvasSchema.statics.getAllCanvases = async function (email) {
  try {
    const user = await mongoose.model("User").findOne({ email });

    if (!user) {
      return [];
    }

    const canvases = await this.find({
      $or: [{ owner: user._id }, { sharedWith: user._id }],
    })
      .sort({ createdAt: -1 })
      .populate("owner", "username email")
      .populate("sharedWith", "username email")
      .select("-elements");

    return canvases;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching canvases",
    );
  }
};

canvasSchema.statics.createCanvas = async function (name, ownerId) {
  try {
    // check if this canvas name already exists for this user where he is owner
    const existingCanvas = await this.findOne({ name, owner: ownerId });
    if (existingCanvas) {
      throw new ApiError(409, "Canvas with this name already exists");
    }
    const canvas = await this.create({
      name,
      owner: ownerId,
      elements: [],
      sharedWith: [],
    });
    return canvas;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error creating canvas",
    );
  }
};

canvasSchema.statics.getCanvas = async function (canvasId, userId) {
  try {
    const canvas = await this.findOne({
      _id: canvasId,
      $or: [{ owner: userId }, { sharedWith: userId }],
    })
      .populate("owner", "username email")
      .populate("sharedWith", "username email");
    if (!canvas) {
      throw new ApiError(404, "Canvas not found or access denied");
    }
    return canvas;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching canvas",
    );
  }
};

canvasSchema.statics.deleteCanvas = async function (canvasId, userId) {
  try {
    const result = await this.deleteOne({
      _id: canvasId,
      owner: userId, // only owner can delete the canvas
    });
    return result.deletedCount > 0; // return true if a canvas was deleted
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error deleting canvas",
    );
  }
};

canvasSchema.statics.updateCanvas = async function (
  canvasId,
  userId,
  elements,
) {
  try {
    const canvas = await this.findOneAndUpdate(
      { _id: canvasId, $or: [{ owner: userId }, { sharedWith: userId }] }, // only owner and shared users can update the canvas
      { elements },
      { returnDocument: "after" }, // return updated doc, not old one
    );
    if (!canvas) {
      throw new ApiError(404, "Canvas not found or access denied");
    }
    return canvas;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error updating canvas",
    );
  }
};

const Canvas = mongoose.model("Canvas", canvasSchema);

export default Canvas;
