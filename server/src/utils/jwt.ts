import createHttpError from "http-errors";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import logger from "../logger";
import jwt from "jsonwebtoken";
import JWTPayload from "../customTypes/JWTPayload";
import RedisClientWrapper from "./initRedis";
import ms from "ms";

const ACCESS_TOKEN_EXPIRATION = "2h";
const REFRESH_TOKEN_EXPIRATION = "1y";

/** Returns a promise either resolving with the generated token or rejecting with an error */
// Used for both generating the access token and the refresh token
export function generateSignedAccessToken(
  userId: string,
  tokenType: "access-token" | "refresh-token" = "access-token"
): Promise<string> {
  const { JWT_SIGNING_KEY, REFRESH_TOKEN_KEY } = process.env;

  let signingSecret: string;
  let expiresIn: string;

  switch (tokenType) {
    case "access-token":
      signingSecret = JWT_SIGNING_KEY;
      expiresIn = ACCESS_TOKEN_EXPIRATION; // Set a default value if not provided
      break;

    case "refresh-token":
      signingSecret = REFRESH_TOKEN_KEY;
      expiresIn = REFRESH_TOKEN_EXPIRATION; // Set a default value if not provided
      break;

    default:
      logger.debug(
        `Invalid singing secret was passed. Failed to generate ${tokenType}.`
      );
      // Should be propagated to the handler
      return Promise.reject(
        createHttpError.InternalServerError(`Failed to generate ${tokenType}.`)
      );
  }

  /** Data included in the JWT payload */
  const payload = {
    tokenType,
  };

  // Add relevant options like expiresIn, algorithm, etc.
  const options: SignOptions = {
    expiresIn: expiresIn!, // Specifies when the token should expire
    issuer: "martin-mohammed.info", // Indicates the issuer of the token
    subject: userId, // Specifies the subject of the token, usually the user ID
    audience: "example.com", // Specifies the intended location or context where the token will be used
  };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, signingSecret, options, (error, token) => {
      if (error) {
        logger.debug(`Failed to generate new ${tokenType}. ${error.message}`);
        reject(
          createHttpError.InternalServerError(
            `Failed to generate ${tokenType}.`
          )
        );
      } else if (!token) {
        logger.debug(`Failed to generate new ${tokenType}.`);
        reject(
          createHttpError.InternalServerError(`${tokenType} was not generated.`)
        );
      } else {
        logger.verbose(`A new ${tokenType} was generated.`);

        if (tokenType === "refresh-token") {
          // If type of token is 'refresh-token' then we want to store it in redis
          RedisClientWrapper.getInstance()
            .client.set(userId, token, {
              // Divide by 1000 to get seconds.
              EX: ms(REFRESH_TOKEN_EXPIRATION) / 1000,
            })
            .then(() => {
              // If token was saved in redis.
              logger.info(`Refresh token was saved in redis db.`);
              resolve(token);
            })
            .catch((error) => reject(error));
        } else {
          return resolve(token);
        }
      }
    });
  });
}

/**
 * Used to verify the refresh token sent to the refresh-token route in case the access-token expired.
 * Return the userId of the token.
 */
export function verifyRefreshToken(
  refreshToken: string
): Promise<JWTPayload["subject"]> {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, payload) => {
      if (err) {
        const errorMessage =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.name;
        logger.warn("Received an invalid JWT Refresh token.");
        return reject(createHttpError.Unauthorized(errorMessage));
      }
      logger.verbose("Refresh token signature is verified.");
      const userId: JwtPayload["sub"] = payload?.sub as string;

      /** Now received the payload, and knowning that the token is valid, check if that token is valid in redis  */
      RedisClientWrapper.getInstance()
        .client.GET(payload?.sub as string)
        .then((value) => {
          if (!value || value !== refreshToken) {
            // This particular refresh token is not contained in redis db.
            logger.warn(
              `Refresh token is not contained in db for user: ${userId}.`
            );
            return reject(createHttpError.Unauthorized("Unauthorized"));
          }
          logger.verbose(
            `Refresh token is contained in db for user: ${userId}.`
          );
          return resolve(userId);
        })
        .catch((err) => {
          logger.error(
            `Failed to retrieve refresh token of userId: ${userId}. ${err.message}`
          );
          return reject(createHttpError.InternalServerError());
        });
    });
  });
}
