import express from "express";
import cors from "cors";
import connectDB from "./src/database/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/user.route.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json()); //the data is JSON on the client side , But when it travels over HTTP, it becomes raw text (string), so we parse it into json here
app.use(cors());

connectDB();
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Whiteboard App API");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
