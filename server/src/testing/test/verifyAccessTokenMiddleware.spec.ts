import express from "express";
import createHttpError from "http-errors";
import logger from "../../logger";
import { generateSignedAccessToken } from "../../utils/jwt";
import verifyAccessTokenMiddleware from "../../middlewares/verifyAccessTokenMiddleware";
verifyAccessTokenMiddleware;

/**
 * Test suite for the verifyAccessTokenMiddleware function.
 */
describe("verifyAccessTokenMiddleware Function Test", () => {
  let demoRequestObject: express.Request;
  let demoResponseObject: express.Response = {} as express.Response;
  let demoNextFunction: express.NextFunction = jest.fn();
  let accessToken: string;

  beforeAll(async () => {
    // Generate a new accessToken
    accessToken = await generateSignedAccessToken(
      "<DEMO-USER_ID>",
      "access-token"
    );
    // Ensure that the accessToken is generated successfully
    expect(accessToken).not.toBeFalsy();

    // Create demoRequestObject using spread operator
    demoRequestObject = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    } as express.Request;
  });

  /**
   * Test cases with a valid authorization token.
   */
  describe("Valid Authorization Token Test Cases", () => {
    it("should call the next function and successfully validate the JWT token", async () => {
      // Call the verifyAccessTokenMiddleware function
      await verifyAccessTokenMiddleware(
        demoRequestObject,
        demoResponseObject,
        demoNextFunction
      );

      // Ensure that the next function is called
      expect(demoNextFunction).toBeCalled();
      const fields = ["iat", "exp", "aud", "iss", "sub"];

      // Use destructuring to simplify the code
      const { user } = demoRequestObject;
      // Ensure that the user object is defined
      expect(user).not.toBeUndefined();

      // Check if the payload of the token was returned and if the required fields are inside
      fields.forEach((payloadField) => {
        expect(payloadField in user).toBeTruthy();
      });

      // Ensure that the logger.verbose function is called
      expect(logger.verbose).toBeCalledWith("Access Token is valid.");
    });
  });

  /**
   * Test cases without a valid authorization token.
   */
  describe("Invalid Authorization Token Test Cases", () => {
    it("should call next with Unauthorized error if no authHeader was provided", async () => {
      // Create a request object with no authHeader
      const invalidAuthHeaderRequest: express.Request = {
        headers: {},
      } as express.Request;

      // Call the verifyAccessTokenMiddleware function
      await verifyAccessTokenMiddleware(
        invalidAuthHeaderRequest,
        demoResponseObject,
        demoNextFunction
      );

      // Ensure that the next function is called with the Unauthorized error
      const expectedError = createHttpError.Unauthorized();
      expect(demoNextFunction).toBeCalledWith(expectedError);
    });

    it("should call next function with Unauthorized error if the token is invalid", async () => {
      // Create a request object with an invalid token
      const invalidTokenRequest: express.Request = {
        headers: {
          authorization: `Bearer ${accessToken.replace(".", "|")}`,
        },
      } as express.Request;

      // Call the verifyAccessTokenMiddleware function
      await verifyAccessTokenMiddleware(
        invalidTokenRequest,
        demoResponseObject,
        demoNextFunction
      );

      // Ensure that the logger.warn function is called
      expect(logger.warn).toBeCalledWith(
        "Received an invalid JWT Access token."
      );

      // Ensure that the next function is called with the Unauthorized error
      const expectedError = createHttpError.Unauthorized("Unauthorized");
      expect(demoNextFunction).toBeCalledWith(expectedError);
    });
  });

  afterEach(() => {
    // Clear all mock function calls after each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore all mocked functions after all tests
    jest.restoreAllMocks();
  });
});
