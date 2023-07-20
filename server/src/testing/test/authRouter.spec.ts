import mongoose, { HydratedDocument } from "mongoose";
import Employee from "../../models/Employee";
import demoUser from "../data/demoUser";
import supertest from "supertest";
import app from "../../app";
import createHttpError from "http-errors";
import { createClient } from "redis";
import initMongoDb from "../../utils/initMongoDb";
import RedisClientWrapper from "../../utils/initRedis";
import ms from "ms";
import logger from "../../logger";
import IEmployee from "../../customTypes/Employee";
import jwt, { SignOptions } from "jsonwebtoken";
describe("Testing the auth router: ", () => {
  let redisClient: ReturnType<typeof createClient> | null;
  let userRefOfInitialUser: HydratedDocument<IEmployee>;
  let refreshTokenOfInitialUser: string;
  let accessTokenOfInitialUser: string;

  beforeAll(async () => {
    // Connect to the test database
    await initMongoDb();

    // Get the Redis client instance and connect to Redis
    redisClient = RedisClientWrapper.getInstance().client;
    await redisClient.connect();

    // Ensure that the Redis client is not null (has been successfully initialized)
    expect(redisClient).not.toBeNull();
  });

  beforeEach(async () => {
    // Create a demo user in the database
    userRefOfInitialUser = await new Employee(demoUser).save();

    // Ensure that the user reference is not null (user creation was successful)
    expect(userRefOfInitialUser).not.toBeNull();
  });

  describe("/auth/register", () => {
    it("should fail to register a new user with missing data: ", async () => {
      // Define the expected error message when password is missing
      const expectedErrorMessage = `"password" is required`;

      // Send a POST request to register a new user with missing password
      const { body, statusCode } = await supertest(app)
        .post("/auth/register")
        .send({ email: demoUser.email });

      // Verify that the error message in the response matches the expected error message
      expect(body?.error?.message).toBe(expectedErrorMessage);

      // Verify that the response status code is 422 (Unprocessable Entity)
      expect(statusCode).toBe(422);
    });
    it("should fail to register an existing user: ", async () => {
      // Create the expected error using createHttpError.Conflict
      const { statusCode: expectedStatusCode, message: expectedMessage } =
        createHttpError.Conflict(
          `${demoUser.email.toLowerCase()} is already been registered.`
        );

      // Send a POST request to register an existing user
      const { body, statusCode } = await supertest(app)
        .post("/auth/register")
        .send(demoUser);

      // Verify that the response status code matches the expected status code
      expect(statusCode).toBe(expectedStatusCode);

      // Verify that the error message in the response matches the expected error message
      expect(body?.error?.message).toBe(expectedMessage);

      // Verify that the error status code in the response matches the expected status code
      expect(body?.error?.statusCode).toBe(expectedStatusCode);
    });

    it("should create a brand new user in the db with hashed password and return tokens, in which the tokens match the payload of user: ", async () => {
      // Define the new user data
      const newDemoUser = { email: "demo@demo.com", password: "demo.demo" };

      // Send a POST request to register the new user
      const { body, statusCode } = await supertest(app)
        .post("/auth/register")
        .send(newDemoUser);

      // Verify that the response status code is 200 (OK)
      expect(statusCode).toBe(200);

      // Retrieve the access token and refresh token from the response body
      const { accessToken, refreshToken } = body;

      // Verify that the access token and refresh token are not undefined
      expect(accessToken).not.toBeUndefined();
      expect(refreshToken).not.toBeUndefined();

      // Check if the user was created in the database
      const expectedUser = await Employee.findOne({ email: newDemoUser.email });
      expect(expectedUser).not.toBeNull();

      // Store the refresh token for future use
      refreshTokenOfInitialUser = refreshToken;
      accessTokenOfInitialUser = accessToken;

      // Check if the refresh token was saved inside the Redis database
      expect(await redisClient?.GET(expectedUser!.id)).toBe(refreshToken);

      // Check if the TTL of the entry is around 1 year
      // The TTL should be greater than 1 year in seconds minus 60 seconds
      expect(await redisClient?.TTL(expectedUser!.id)).toBeGreaterThan(
        ms("1y") / 1000 - 60
      );

      // Check if the password was hashed
      expect(expectedUser?.password).not.toEqual(demoUser.password);

      // Verify the payload of the access token
      const payload: jwt.JwtPayload = await new Promise((resolve, reject) => {
        jwt.verify(
          accessToken,
          process.env.JWT_SIGNING_KEY,
          (err: any, payload: any) => {
            // Verify that there are no errors during token verification
            expect(err).toBeNull();
            resolve(payload as jwt.JwtPayload);
          }
        );
      });

      // Verify the presence of specific properties in the payload
      expect("iat" in payload).toBeTruthy();
      expect("exp" in payload).toBeTruthy();
      expect("aud" in payload).toBeTruthy();

      // Verify the values of specific payload properties
      expect(payload["iss"]).toBe("martin-mohammed.info");
      expect(payload["sub"]).toBe(expectedUser?.id);
    });
  });

  describe("/auth/login", () => {
    it("should fail if email is missing in the request body: ", async () => {
      // Define the expected error message when email is missing
      const expectedErrorMessage = `"email" is required`;

      // Send a POST request to register a new user with missing email
      const { body, statusCode } = await supertest(app)
        .post("/auth/register")
        .send({ password: demoUser.password });

      // Verify that the error message in the response matches the expected error message
      expect(body?.error?.message).toBe(expectedErrorMessage);

      // Verify that the response status code is 422 (Unprocessable Entity)
      expect(statusCode).toBe(422);
    });

    it("should fail if there is no user for the provided email: ", async () => {
      // Define the expected error when the user is not registered
      const expectedError = createHttpError.NotFound(`User not registered.`);

      // Create a mock user with a non-existing email
      const mockDemouser = {
        email: "not@existing.com",
        password: "not@existing.com",
      };

      // Send a POST request to login with the mock user
      const { body, statusCode } = await supertest(app)
        .post("/auth/login")
        .send(mockDemouser);

      // Verify that the response status code matches the expected error status code
      expect(statusCode).toBe(expectedError.statusCode);

      // Verify that the error message in the response matches the expected error message
      expect(body?.error?.message).toBe(expectedError.message);

      // Verify that the error status code in the response matches the expected error status code
      expect(body?.error?.statusCode).toBe(expectedError.statusCode);
    });

    it("should fail if the user logs in with an unmatching password: ", async () => {
      // Define the expected error when the password does not match
      const expectedError = createHttpError.Unauthorized(
        "Invalid Username or Password."
      );

      // Send a POST request to login with the user's email and an unmatching password
      const { body, statusCode } = await supertest(app)
        .post("/auth/login")
        .send({ email: demoUser.email, password: "definitely-false" });

      // Verify that the logger.warn function is called with the expected log message
      expect(logger.warn).toBeCalledWith(
        `User ${demoUser.email.toLowerCase()} entered the wrong password.`
      );

      // Verify that the response status code matches the expected error status code
      expect(statusCode).toBe(expectedError.statusCode);

      // Verify that the error message in the response matches the expected error message
      expect(body?.error?.message).toBe(expectedError.message);

      // Verify that the error status code in the response matches the expected error status code
      expect(body?.error?.statusCode).toBe(expectedError.statusCode);
    });

    it("should generate a new pair of tokens if the login was successful, and the refresh token should be overwritten: ", async () => {
      // Login to generate a new pair of tokens
      const { body: loginBody, statusCode: loginStatusCode } = await supertest(
        app
      )
        .post("/auth/login")
        .send(demoUser);

      // Verify that the login was successful
      expect(loginStatusCode).toBe(200);
      const newRefreshToken = loginBody["refreshToken"];
      const newAccessToken = loginBody["accessToken"];
      expect(newRefreshToken).not.toBeUndefined();
      expect(newAccessToken).not.toBeUndefined();

      // Verify that the login refresh token is stored in Redis
      expect(await redisClient?.GET(userRefOfInitialUser!.id)).toBe(
        newRefreshToken
      );

      // Verify that the new access token is different from the initial access token
      expect(accessTokenOfInitialUser).not.toEqual(newAccessToken);

      // Verify that the new refresh token is different from the initial refresh token
      expect(refreshTokenOfInitialUser).not.toBe(newRefreshToken);

      // Check if the refresh token was overwritten in Redis
      const userRef = await Employee.findOne({ email: demoUser.email });
      expect(userRef).not.toBeNull();
      const overwrittenRefreshToken = await redisClient?.GET(userRef?.id);
      expect(overwrittenRefreshToken).not.toBe(refreshTokenOfInitialUser);
      expect(overwrittenRefreshToken).toBe(newRefreshToken);
      refreshTokenOfInitialUser = newRefreshToken;
    });
  });

  describe("/auth/refresh-token", () => {
    it("should generate a new pair of tokens: ", async () => {
      // Create a new user with valid credentials
      const newDemouser = {
        email: "valid@valid.com",
        password: "valid@valid.com",
      };

      // Register the user and retrieve the access token and refresh token
      const registerResponse = await supertest(app)
        .post("/auth/register")
        .send(newDemouser);
      expect(registerResponse.statusCode).toBe(200);
      const registerAccessToken = registerResponse.body["accessToken"];
      const registerRefreshToken = registerResponse.body["refreshToken"];
      expect(registerAccessToken).not.toBeFalsy();
      expect(registerRefreshToken).not.toBeFalsy();

      // Wait for 1 second to simulate time passing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use the refresh token to generate a new pair of tokens
      const refreshTokenResponse = await supertest(app)
        .post("/auth/refresh-token")
        .send({ refreshToken: registerRefreshToken });
      expect(refreshTokenResponse.statusCode).toBe(200);
      const newAccessToken = refreshTokenResponse.body["accessToken"];
      const newRefreshToken = refreshTokenResponse.body["refreshToken"];
      expect(newAccessToken).not.toBeFalsy();
      expect(newRefreshToken).not.toBeFalsy();
      expect(newAccessToken).not.toBe(registerAccessToken);
      expect(newRefreshToken).not.toBe(registerRefreshToken);

      // Check if the refresh token in Redis is overridden
      const expectedUser = await Employee.findOne({ email: newDemouser.email });
      const expectedNewRefreshToken = await redisClient?.GET(expectedUser?.id);
      expect(expectedNewRefreshToken).toBe(newRefreshToken);
    });

    it("should fail if no refresh token was provided: ", async () => {
      // Define the expected error when no refresh token is provided
      const expectedError = createHttpError.BadRequest(
        "No refreshToken was attached to body."
      );

      // Send a POST request without a refresh token
      const { body, statusCode } = await supertest(app)
        .post("/auth/refresh-token")
        .send({ refreshToken: undefined });

      // Verify that the response status code and error message match the expected values
      expect(statusCode).toBe(expectedError.statusCode);
      expect(body?.error?.message).toBe(expectedError.message);
      expect(body?.error?.statusCode).toBe(expectedError.statusCode);
    });

    it("should fail if the refresh token expired (invalid): ", async () => {
      // Data included in the JWT payload
      const payload = {
        tokenType: "refresh-token",
      };

      // Add relevant options like expiresIn, algorithm, etc.
      const options: SignOptions = {
        expiresIn: "1s", // Specifies when the token should expire
        issuer: "martin-mohammed.info", // Indicates the issuer of the token
        subject: userRefOfInitialUser.id, // Specifies the subject of the token, usually the user ID
        audience: "example.com", // Specifies the intended location or context where the token will be used
      };

      // Generate an invalid refresh token by signing the payload with a short expiration time
      const invalidRefreshTokenOfInitialUser = await new Promise(
        (resolve, reject) => {
          jwt.sign(
            payload,
            process.env.JWT_SIGNING_KEY,
            options,
            (error, token) => {
              expect(error).toBeNull();
              resolve(token);
            }
          );
        }
      );

      // Ensure that the invalid refresh token is not undefined
      expect(invalidRefreshTokenOfInitialUser).not.toBeUndefined();

      // Wait for the invalid refresh token to expire
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(undefined);
        }, 1200);
      });

      // Define the expected error
      const expectedError = createHttpError.Unauthorized("Unauthorized");

      // Send a POST request to refresh the token with the expired refresh token
      const { body, statusCode } = await supertest(app)
        .post("/auth/refresh-token")
        .send({ refreshToken: invalidRefreshTokenOfInitialUser });

      // Verify that the logger.warn function was called with the expected message
      expect(logger.warn).toBeCalledWith(
        `Received an invalid JWT Refresh token.`
      );

      // Verify that the response status code matches the expected error status code
      expect(statusCode).toBe(expectedError.statusCode);

      // Verify that the error message in the response matches the expected error message
      expect(body?.error?.message).toBe(expectedError.message);

      // Verify that the error status code in the response matches the expected error status code
      expect(body?.error?.statusCode).toBe(expectedError.statusCode);
    });
  });

  describe("/auth/logout", () => {
    it("should fail if no refresh token was provided: ", async () => {
      // Define the expected error for a bad request
      const expectedError = createHttpError.BadRequest();

      // Send a DELETE request to logout without providing a refresh token
      const { body, statusCode } = await supertest(app)
        .delete("/auth/logout")
        .send({ refreshToken: undefined });

      // Verify that the response status code matches the expected error status code
      expect(statusCode).toBe(expectedError.statusCode);

      // Verify that the error message in the response matches the expected error message
      expect(body?.error?.message).toBe(expectedError.message);

      // Verify that the error status code in the response matches the expected error status code
      expect(body?.error?.statusCode).toBe(expectedError.statusCode);
    });

    it("should log out the user and remove the refresh token in the Redis DB.", async () => {
      // Send a DELETE request to log out the user with the initial refresh token
      const { body, statusCode } = await supertest(app)
        .delete("/auth/logout")
        .send({ refreshToken: refreshTokenOfInitialUser });

      // Verify that the refresh token of the initial user is removed from the Redis DB
      const expectedRefreshTokenOfInitialUser = await redisClient?.get(
        userRefOfInitialUser?.id
      );
      expect(expectedRefreshTokenOfInitialUser).toBeFalsy();
      // Verify that the response status code is 204 (No Content)
      expect(statusCode).toBe(204);

      // Verify that the response body is an empty object
      expect(body).toEqual({});
    });
  });

  afterEach(async () => {
    await Employee.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
});
