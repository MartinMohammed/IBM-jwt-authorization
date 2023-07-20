import express from "express";
import { respondToHealthCheck } from "../controllers/healthController";

const healthRouter = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check health
 *     description: Responds to the health check request made by the Elastic Load Balancer.
 *     responses:
 *       '200':
 *         description: Successful response. Indicates that the service is healthy.
 */

healthRouter.get("/", respondToHealthCheck);

export default healthRouter;
