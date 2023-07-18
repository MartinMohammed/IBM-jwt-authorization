import express from "express";
import logger from "../logger";
import HTTPError from "../customTypes/HTTPError";

/**
 * Error handler middleware.
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
function errorHandler(
  err: HTTPError,
  req: express.Request,
  res: express.Response,
  _: express.NextFunction
) {
  logger.error("An error occurred: ", err);
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
}

export default errorHandler;
