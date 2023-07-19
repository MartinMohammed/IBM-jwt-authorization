import express from "express";
import { respondToHealthCheck } from "../controllers/healthController";

const healthRouter = express.Router();

// Handle the GET request by the Elastic Load Balancer
// To make a health check
healthRouter.get("/", respondToHealthCheck);

export default healthRouter;
