import express from "express";
const swaggerRouter = express.Router();
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "../utils/swaggerOptions";

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const openapiSpecification = swaggerJsdoc(swaggerOptions);

swaggerRouter.use("/", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

export default swaggerRouter;
