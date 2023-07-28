[![Checks](https://github.com/body-culture/jwt-authorization/actions/workflows/checks.yaml/badge.svg)](https://github.com/body-culture/jwt-authorization/actions/workflows/checks.yaml)


# Project Overview - Authorization Server for WhatsApp Bot Project

This section represents the demo public version of the authorization server developed as part of the collaborative project between IBM and Body Culture Group. My role in the project involved project management and task delegation. The project comprises several components, including a client Svelte application, a WhatsApp middleware for message reception (published on npm), and a backend with a WebSocket server and REST API.

The application utilizes the JSON Web Token (JWT) mechanism for user authentication, enabling secure access to the dashboard and REST API.

## Auth API - Secure Authentication Service

The Auth API is a secure authentication service that facilitates user registration, login, and management of authentication tokens. It incorporates various endpoints for user registration, login, token refreshing, and logout operations. To ensure security, the API implements JSON Web Tokens (JWT) for authentication and utilizes Redis for managing refresh tokens.

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

Once the Auth API is up and running, you can access various endpoints to register users, login, refresh tokens, and logout. For protected endpoints, the API requires the inclusion of the access token in the `Authorization` header.

## API Endpoints

The Auth API provides the following endpoints:

1. **POST /auth/register**: Register a new user and receive a new pair of tokens.
2. **POST /auth/login**: Login with existing credentials and receive a new pair of tokens.
3. **POST /auth/refresh-token**: Generate a new pair of tokens using the refresh token.
4. **DELETE /auth/logout**: Logout a user and invalidate their refresh token.
5. **GET /health**: Check the health status of the service.

## Authentication

The Auth API leverages JWT for authentication. When a user registers or logs in, the API returns an access token and a refresh token as a pair. The access token is used to authenticate protected endpoints by including it in the `Authorization` header with the `Bearer` scheme. In case the access token expires, users can use the refresh token to obtain a new pair of tokens.

## Error Handling

The Auth API responds with appropriate HTTP status codes and error messages in JSON format for various scenarios. Common error responses include `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, and `422 Unprocessable Entity`. Error responses include a `message` field with a description of the error and a `statusCode` field indicating the corresponding HTTP status code.

## Swagger UI

The Auth API provides a Swagger UI for API documentation, accessible by visiting `/api-docs` after starting the server. The Swagger UI offers a user-friendly interface to explore and interact with the API endpoints.

## Dependencies

The Auth API relies on the following major dependencies:

- Express: A web application framework for handling HTTP requests and routing.
- Mongoose: An Object Data Modeling (ODM) library for MongoDB.
- bcrypt: A library for hashing passwords using the Blowfish algorithm.
- jsonwebtoken: A library for generating and verifying JSON Web Tokens (JWT).
- redis: A library for working with Redis, a key-value store used to manage refresh tokens.
- swagger-jsdoc and swagger-ui-express: Libraries for generating and displaying API documentation using OpenAPI (Swagger).

For a comprehensive list of dependencies, refer to the `package.json` file.

## Contributing

Contributions to the Auth API are welcome! If you encounter any issues or have suggestions for improvements, please feel free to submit a pull request.

## License

The Auth API is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT). The full license text is available in the `LICENSE` file.

---
With this update, the section now contains additional information about the WhatsApp Bot Project, the responsibilities in the project, and the various components involved. The section also provides detailed information about the Auth API, including installation instructions, API endpoints, authentication mechanism, error handling, Swagger UI for documentation, dependencies, contributing guidelines, and licensing information. The section now serves as a comprehensive guide for anyone interested in using or contributing to the Auth API.
