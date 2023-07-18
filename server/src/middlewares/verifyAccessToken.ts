import express from "express";
import createHttpError from "http-errors";
import JWTPayload from "../customTypes/JWTPayload";
import jwt from "jsonwebtoken";
import logger from "../logger";

// Middleware
function verifyAccessToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // If token is invalid, pass http error to next function
  if (!req.headers["authorization"]) {
    return next(createHttpError.Unauthorized());
  }
  const authHeader = req.headers["authorization"];
  // Format: Bearer XXX
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  /**
   * 1. Decoding of the header & payload and signature
   * 2. Signature verification (hash payload and header and compare with prov. signature)
   * 3. Claims Validation (after signature is verfied)
   */
  jwt.verify(token, process.env.JWT_SIGNING_KEY, (err, payload) => {
    req.user = payload as JWTPayload;
    if (err) {
      const errorMessage =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.name;
      logger.warn("Received an invalid JWT Access token.");
      return next(createHttpError.Unauthorized(errorMessage));
    }
    logger.verbose("Access Token is valid.");
    // User is authorized.
    next();
  });
}

export default verifyAccessToken;
