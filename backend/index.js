import express from "express";
import cors from "cors";
import connectDB from "./src/database/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/user.route.js";
import canvasRoutes from "./src/routes/canvas.route.js";
import http from "node:http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./src/models/user.model.js";
import Canvas from "./src/models/canvas.model.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3030;
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://white-board-app-3n4r.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" })); //the data is JSON on the client side , But when it travels over HTTP, it becomes raw text (string), so we parse it into json here
app.use(express.urlencoded({ limit: "10mb", extended: true }));

await connectDB();
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/canvases", canvasRoutes);

// create http server and socket.io server using express app
const server = http.createServer(app);
// Attach Socket.IO to the server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://white-board-app-3n4r.vercel.app",
    ],
    credentials: true,
  },
});

const parseCookies = (cookieHeader = "") => {
  return cookieHeader.split(";").reduce((acc, cookiePart) => {
    const [rawKey, ...rawValue] = cookiePart.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rawValue.join("="));
    return acc;
  }, {});
};

io.use(async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers?.cookie || "";
    const cookies = parseCookies(cookieHeader);
    const token = cookies.accessToken;

    if (!token) {
      return next(new Error("NoAccessToken"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(new Error("AccessTokenExpired"));
      }
      return next(new Error("InvalidAccessToken"));
    }

    const user = await User.findById(decoded._id).select("_id username email");
    if (!user) {
      return next(new Error("InvalidUser"));
    }

    socket.user = user;
    next();
  } catch (_) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id, socket.user?.email);

  // join room
  socket.on("joinCanvas", async (canvasId) => {
    const hasAccess = await Canvas.findOne({
      _id: canvasId,
      $or: [{ owner: socket.user._id }, { sharedWith: socket.user._id }],
    }).select("_id");

    if (!hasAccess) {
      socket.emit("canvas:error", {
        message: "Canvas not found or access denied",
      });
      return;
    }

    socket.join(canvasId);
  });

  // receive drawing and broadcast
  socket.on("draw", ({ canvasId, elements }) => {
    socket.to(canvasId).emit("draw", {
      senderSocketId: socket.id,
      senderUserId: socket.user?._id?.toString(),
      elements,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
