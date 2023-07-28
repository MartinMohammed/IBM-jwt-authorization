[![Checks](https://github.com/body-culture/jwt-authorization/actions/workflows/checks.yaml/badge.svg)](https://github.com/body-culture/jwt-authorization/actions/workflows/checks.yaml)

# Fitness App Suite

Welcome to the Fitness App Suite, a collection of applications developed during my internship at IBM in collaboration with the Body Culture Group in Darmstadt. This suite includes the Gym Occupancy Tracker, a Svelte Frontend Dashboard, a Webhook API Server, an Authorization Server with JWT, and the successful WhatsApp Middleware npm package.

## Overview

During my internship at IBM, I took on the role of Product Owner for a project in collaboration with the Body Culture Group in Darmstadt. Body Culture is a prominent player in the fitness industry with over 300 employees in Hessen and multiple sub-brands, dominating the market in the Rhine-Main Area.

As part of my responsibilities, I led the design of a comprehensive AWS Cloud Infrastructure. This involved various tasks such as networking with VPCs and implementing essential services like API Gateway and DynamoDB. To achieve rapid and efficient cloud infrastructure deployment and updates, I utilized the Cloud Development Kit as an Infrastructure as Code technology.

The primary focus of the project was to integrate a custom WhatsApp Chatbot using the Meta WhatsApp Cloud API. To accomplish this, I developed a fully functional WhatsApp Dashboard using Svelte, a high-speed JavaScript Framework. For the backend, I employed REST API and WebSockets for real-time message communication. Security was a crucial aspect, and I ensured robust protection by implementing JWT authentication and leveraging AWS Cognito service to safeguard the API Gateway.

The success of the WhatsApp Chatbot was impressive, as it garnered widespread interest and achieved over 4000 weekly downloads on NPM within the first two weeks of its release. Additionally, I integrated the WhatsAppBot with Google's Dialogflow, allowing the bot to utilize artificial intelligence to respond to user messages in the fitness studios. This innovative approach effectively transformed customer service from traditional telephone communication to fully automated interactions via WhatsAppBot, resulting in increased conversion rates for new customer sign-ups. Users could easily share the WhatsApp business account with friends, while the bot handled all membership-related information, including scheduling a suitable slot within a week.

### Quick navigation 



- [Svelte Frontend Dashboard Repository](https://github.com/MartinMohammed/IBM-whatsapp-bot-frontend)
- [WhatsApp Backend Server Repository](https://github.com/MartinMohammed/IBM-whatsapp-bot-backend)
- [Gym Occupancy Tracker Repository](https://github.com/MartinMohammed/IBM-whatsapp-occupancy-scraper)
- [WhatsApp Middleware NPM Package](https://github.com/MartinMohammed/IBM-whatsapp-bot-middleware-npm)

## Svelte Frontend Dashboard

The Svelte Frontend Dashboard is a web application designed for the CRS team to interact with gym members and facilitate automated WhatsApp customer service. Built with Svelte, it utilizes websockets to fetch real-time data from the backend, including recent WhatsApp messages. The production version includes a permission system, enabling admin privileges and integration with Google's Dialogflow chatbot AI.

![Login Screen](https://github.com/MartinMohammed/whataspp-dashboard-svelte/assets/81469658/9cc033d6-48c3-4efd-bd2d-b81fce6df6c3.png)

![Chat Screen](https://github.com/MartinMohammed/whataspp-dashboard-svelte/assets/81469658/377f62d9-581f-4230-b6c0-e3f20f5a4c23.png)
## WhatsApp Backend Server

The WhatsApp Backend server is responsible for delivering new incoming messages to the WhatsApp dashboard and thus to the customer service in real time using web sockets and sending messages to gym members via the WhatsApp Cloud API. It provides a protected REST API and as well a web socket server. It stores all messages that were sent in a NoSQL database on AWS.

[Link to WhatsApp Backend Server Repository](https://github.com/MartinMohammed/IBM-whatsapp-bot-backend)

# Project Overview - Authorization Server for WhatsApp Bot Project

This section represents the demo public version of the authorization server developed as part of the collaborative project between IBM and Body Culture Group. My role in the project involved project management and task delegation. The project comprises several components, including a client Svelte application, a WhatsApp middleware for message reception (published on npm), and a backend with a WebSocket server and REST API.

The application utilizes the JSON Web Token (JWT) mechanism for user authentication, enabling secure access to the dashboard and REST API.

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


## Gym Occupancy Tracker

The Gym Occupancy Tracker is a Python program that web-scrapes the Fitness Fabrik gym website to extract data about the current number of people training in the gym. It uses Beautiful Soup to parse the HTML and extract relevant data. The program also integrates with a Telegram bot to notify users when the gym occupancy meets their desired criteria.

[Link to Gym Occupancy Tracker Repository](https://github.com/MartinMohammed/IBM-whatsapp-occupancy-scraper)

## WhatsApp Middleware NPM Package

The WhatsApp Middleware Package is a highly successful npm package developed during my internship at IBM. It serves as a crucial component of the Fitness App Suite, enabling seamless integration with the WhatsApp Chatbot and real-time message communication.

[Link to WhatsApp Middleware NPM package](https://github.com/MartinMohammed/IBM-whatsapp-bot-middleware-npm)

## Conclusion

The Fitness App Suite brings together a range of applications to improve the fitness experience for users and streamline customer service. Each application serves a specific purpose in the overall ecosystem, offering features such as gym occupancy tracking, real-time notifications, and secure authentication.

Feel free to explore each application's repository for more details and contributions. If you have any questions or suggestions, don't hesitate to reach out. Happy coding!
