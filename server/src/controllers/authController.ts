import authSchema from "../utils/validation/authSchema";
import createHttpError from "http-errors";
import mongoose, { HydratedDocument } from "mongoose";
import User from "../models/User";
import { generateSignedAccessToken, verifyRefreshToken } from "../utils/jwt";
import IUser from "../customTypes/User";
import express from "express";
import logger from "../logger";
import RedisClientWrapper from "../utils/initRedis";

const register = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Validates a value using the schema and options.
    const result = await authSchema.validateAsync(req.body);

    // Check if the user does already exists.
    const userRef = await User.findOne({ email: result.email }).exec();
    if (userRef !== null) {
      throw createHttpError.Conflict(
        `${result.email} is already been registered.`
      );
    }
    // Create the new user and store it into db..
    const savedUser: HydratedDocument<IUser> = await new User(result).save();

    let accessToken = null;
    let refreshToken = null;
    try {
      // Used for authentication - (header.payload, secret) => digital signature.
      accessToken = await generateSignedAccessToken(
        savedUser.id,
        "access-token"
      );

      // Used to generate a new pair of access token and refresh token when token expired
      refreshToken = await generateSignedAccessToken(
        savedUser.id,
        "refresh-token"
      );
    } catch (error) {
      // In case the function rejects the promise
      return next(error);
    }

    ({
      accessToken,
      refreshToken,
    });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    if ((error as { isJoi?: boolean; status?: number }).isJoi === true) {
      // Handle the error when it is of type Joi
      const joiError = error as { isJoi?: boolean; status?: number };
      joiError.status = 422; // Unproccessable entity
      error = joiError;
    }

    // go to e rror handler middleware
    next(error);
  }
};

const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Validate the request body
    const result = await authSchema.validateAsync(req.body);

    // Check if the user already exists
    const userRef = await User.findOne({ email: result.email }).exec();
    if (!userRef) {
      throw createHttpError.NotFound(`User not registered.`);
    }

    const isMatch = await userRef.isValidPassword(result.password);
    if (!isMatch) {
      logger.warn(`User ${result.email} entered the wrong password.`);
      return next(
        createHttpError.Unauthorized("Invalid Username or Password.")
      );
    }
    let newAccessToken = null;
    let newRefreshToken = null;
    try {
      /** Generate a new access token */
      newAccessToken = await generateSignedAccessToken(
        userRef.id,
        "access-token"
      );

      /** Generate a new refresh token */
      newRefreshToken = await generateSignedAccessToken(
        userRef.id,
        "refresh-token"
      );
    } catch (error) {
      return next(error);
    }
    ({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if ((error as { isJoi?: boolean; status?: number }).isJoi === true) {
      // Handle the error when it is of type Joi
      return next(
        createHttpError.Unauthorized("Invalid Username or Password.")
      );
    }
    return next(error);
  }
};

const refreshToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Extract the refresh token from the body
    const { refreshToken } = req.body;
    if (!refreshToken) {
      // Token is not present
      throw createHttpError.BadRequest("No refreshToken was attached to body.");
    }
    // Verify refresh token - it will throw an error if the token is not valid.
    const userId = await verifyRefreshToken(refreshToken);

    /** Generate a new pair of tokens */
    const newAccessToken = await generateSignedAccessToken(
      userId,
      "access-token"
    );

    const newRefreshToken = await generateSignedAccessToken(
      userId,
      "refresh-token"
    );
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/** User provices his refresh token, and the refresh-token is deleted in redis db. */
const logout = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Extract the refresh token from the body
    const { refreshToken } = req.body;
    if (!refreshToken) {
      // Token is not present
      throw createHttpError.BadRequest();
    }
    // Verify refresh token - it will throw an error if the token is not valid.
    const userId = await verifyRefreshToken(refreshToken);

    // Delete the refresh token of the user in the redis db.
    await RedisClientWrapper.getInstance().client.DEL(userId);
    logger.silly(`User ${userId} was successfully logged out.`);

    // Request succeeded.
    res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
};
