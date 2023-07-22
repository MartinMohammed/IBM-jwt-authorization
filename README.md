[![Checks](https://github.com/body-culture/jwt-authorization/actions/workflows/checks.yaml/badge.svg)](https://github.com/body-culture/jwt-authorization/actions/workflows/checks.yaml)

# Auth API

The Auth API is a secure authentication service that allows users to register, login, and manage their authentication tokens. It provides endpoints for user registration, user login, refreshing access tokens, and logging out. The API uses JSON Web Tokens (JWT) for authentication and Redis for managing refresh tokens.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Swagger UI](#swagger-ui)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Installation

To run the Auth API, follow these steps:

1. Clone the repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Set environment variables in a `.env` file (see `.env.example` for reference).
4. Start the server: `npm start`

## Usage

Once the Auth API is up and running, you can access the various endpoints to register users, login, refresh tokens, and logout. The API uses JWTs for authentication, and you must include the access token in the `Authorization` header for protected endpoints.

## API Endpoints

The following endpoints are available in the Auth API:

1. **POST /auth/register**: Register a new user and retrieve a new pair of tokens.
2. **POST /auth/login**: Login with existing credentials and retrieve a new pair of tokens.
3. **POST /auth/refresh-token**: Generate a new pair of tokens using the refresh token.
4. **DELETE /auth/logout**: Logout a user and destroy their refresh token.
5. **GET /health**: Check the health of the service.

## Authentication

The Auth API uses JWTs for authentication. When a user registers or logs in, the API returns a pair of tokens: an access token and a refresh token. The access token is used to authenticate protected endpoints by including it in the `Authorization` header with the `Bearer` scheme. If the access token expires, the user can use the refresh token to request a new pair of tokens.

## Error Handling

The Auth API returns appropriate HTTP status codes and error messages in JSON format for various scenarios. Common error responses include `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, and `422 Unprocessable Entity`. Error responses include a `message` field with a description of the error and a `statusCode` field with the corresponding HTTP status code.

## Swagger UI

You can access the Swagger UI for API documentation by visiting `/api-docs` after starting the server. The Swagger UI provides a user-friendly interface to explore and interact with the API endpoints.

## Dependencies

The Auth API uses the following major dependencies:

- Express: A web application framework for handling HTTP requests and routing.
- Mongoose: An Object Data Modeling (ODM) library for MongoDB.
- bcrypt: A library for hashing passwords using the Blowfish algorithm.
- jsonwebtoken: A library for generating and verifying JSON Web Tokens (JWT).
- redis: A library for working with Redis, a key-value store used to manage refresh tokens.
- swagger-jsdoc and swagger-ui-express: Libraries for generating and displaying API documentation using OpenAPI (Swagger).

For a complete list of dependencies, see the `package.json` file.

## Contributing

Contributions to the Auth API are welcome! If you find any issues or have improvements to suggest, please feel free to submit a pull request.

## License

The Auth API is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT). You can find the full license text in the `LICENSE` file.
