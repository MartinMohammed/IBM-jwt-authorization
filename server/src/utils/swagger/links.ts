const links = {
  // Link name as identifier
  LogoutUser: {
    operationId: "logoutUser",
    requestBody: {
      refreshToken: "$response.body#/refreshToken",
    },
    description:
      "The `refreshToken` value returned in the response can be used as the `refreshToken` request body field in `POST /auth/logout`",
  },
  NewTokenPair: {
    operationId: "newTokenPair",
    requestBody: {
      refreshToken: "$response.body#/refreshToken",
    },
    description:
      "The `refreshToken` value returned in the response can be used as the `refreshToken` request body field in `POST /auth/refresh-token`",
  },
};

export default links;
