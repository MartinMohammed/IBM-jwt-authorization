import express from "express";
import "dotenv/config";
import notFoundError from "./middlewares/notFoundError";
import errorHandler from "./middlewares/errorHandler";
import morgan from "morgan";
import authRouter from "./routers/authRouter";
import cors from "cors";
import fs from "fs";
import path from "path";
import verifyAccessToken from "./middlewares/verifyAccessToken";
import healthRouter from "./routers/healthRouter";
const app = express();

app.use(cors());
app.use(express.json());

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../logs/access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", verifyAccessToken, async (req, res, next) => {
  res.send("Hello From express.");
});
app.use("/health", healthRouter);

app.use("/auth", authRouter);

// Catch all middleware
app.use(notFoundError);

app.use(errorHandler);

export default app;
