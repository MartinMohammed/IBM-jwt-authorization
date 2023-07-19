import express from "express";

import authController from "../controllers/authController";

/**  /auth */
const authRouter = express.Router();

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.post("/refresh-token", authController.refreshToken);

authRouter.delete("/logout", authController.logout);

export default authRouter;
