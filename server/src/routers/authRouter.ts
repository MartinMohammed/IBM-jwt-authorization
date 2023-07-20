import express from "express";

import authController from "../controllers/authController";

const authRouter = express.Router();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register user & retrieve a new pair of tokens
 *     description: Register a user with email and password to retrieve tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAndLoginRequestBody'  # Reference to the schema for request body
 *
 *     responses:
 *       '200':
 *         description: Contains the authorization tokens.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/AuthResponse'  # Reference to the schema for response
 *         links:
 *           LogoutUser:  # This is an arbitrary name for the link
 *             $ref: '#/components/links/LogoutUser'  # Link reference to LogoutUser definition
 *           NewTokenPair:  # This is another arbitrary name for the link
 *             $ref: '#/components/links/NewTokenPair'  # Link reference to NewTokenPair definition
 *       '409':
 *         description: HTTP Conflict, User is already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralError'  # Reference to the schema for error response
 *             example:
 *               message: 'example@example.com is already registered.'
 *               statusCode: 409
 *       '422':
 *         description: Request body validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralError'  # Reference to the schema for error response
 *             example:
 *               message: "\"password\" is required"
 *               statusCode: 422
 *       # Definition of all uncovered error responses
 *       default:
 *         description: Unexpected Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralError'  # Reference to the schema for error response
 *     externalDocs:
 *       description: Learn more about JWT Authentication
 *       url: https://jwt.io/introduction  # External documentation link
 */
authRouter.post("/register", authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login & retrieve a new pair of tokens
 *     description: Login a user and retrieve new JWT refresh & access tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAndLoginRequestBody'
 *     responses:
 *       '200':
 *         description: Contains the authorization tokens.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/AuthResponse'
 *         links:
 *           LogoutUser:  # <--- arbitrary name for the link
 *             $ref: '#/components/links/LogoutUser'
 *           NewTokenPair:  # <--- arbitrary name for the link
 *             $ref: '#/components/links/NewTokenPair'
 *       '401':
 *         description: Unauthorized, Invalid username or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralError'
 *             example:
 *               message: 'Invalid username or password.'
 *               statusCode: 401
 *       '404':
 *         description: HTTP Not Found, User not registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralError'
 *             example:
 *               message: 'User not registered.'
 *               statusCode: 404
 *       '422':
 *         description: Request body validation error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralError'
 *             example:
 *               message: "\"password\" is required"
 *               statusCode: 422
 *       # Definition of all uncovered error responses
 *       default:
 *         description: Unexpected Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralError'
 *     externalDocs:
 *       description: Learn more about JWT Authentication
 *       url: https://jwt.io/introduction
 */
authRouter.post("/login", authController.login);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     summary: Generate a new pair of tokens
 *     operationId: newTokenPair
 *     description: Use the refresh token to generate a new pair of tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 required: true
 *                 example: "<YOUR-SECRET-REFRESH-TOKEN>"
 *     responses:
 *       '200':
 *         description: A new pair of tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/AuthResponse'
 *       '400':
 *         description: No refresh token was attached to the request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralError'
 *             example:
 *               statusCode: 400
 *               message: No refreshToken was attached to the request body.
 *       default:
 *         description: Unexpected Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralError'
 *     externalDocs:
 *       description: Learn more about JWT Authentication
 *       url: https://jwt.io/introduction
 */

authRouter.post("/refresh-token", authController.refreshToken);

/**
 * @openapi
 * /auth/logout:
 *   delete:
 *     summary: Logout & destroy a refresh token
 *     # operationId or operationRef that specifies the target operation. It can be the same operation or a different operation in the current or external API specification.
 *     operationId: logoutUser
 *     description: Logout a user by destroying their refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 required: true
 *                 example: "<YOUR-SECRET-REFRESH-TOKEN>"
 *     responses:
 *       '204':
 *         description: User was logged out, and the refresh token was destroyed
 *       # Definition of all uncovered error responses
 *       default:
 *         description: Unexpected Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralError'
 *     externalDocs:
 *       description: Learn more about JWT Authentication
 *       url: https://jwt.io/introduction
 */

authRouter.delete("/logout", authController.logout);

export default authRouter;
