import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket";

dotenv.config();

// const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(port, () => {
  console.log("server is running on PORT:" + port);
  connectDB();
});