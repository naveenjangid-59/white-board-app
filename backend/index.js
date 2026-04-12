import express from "express";
import cors from "cors";
import connectDB from "./src/database/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/user.route.js";
import canvasRoutes from "./src/routes/canvas.route.js";
import http from "http";
import { Server } from "socket.io";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: "http://localhost:5173",
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
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join room
  socket.on("joinCanvas", (canvasId) => {
    socket.join(canvasId);
  });

  // receive drawing and broadcast
  socket.on("draw", ({ canvasId, senderId, elements }) => {
    socket.to(canvasId).emit("draw", { senderId, elements });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
