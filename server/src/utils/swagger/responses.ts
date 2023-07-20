const responses = {
  AuthResponse: {
    type: "object",
    properties: {
      accessToken: {
        type: "string",
        example: "<YOUR-SECRET-ACCESS-TOKEN>",
      },
      refreshToken: {
        type: "string",
        example: "<YOUR-SECRET-REFRESH-TOKEN>",
      },
    },
  },
};
export default responses;
