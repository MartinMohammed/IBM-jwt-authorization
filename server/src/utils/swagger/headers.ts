const headers = {
  AuthorizationHeader: {
    description: "Token used for jwt authentication.",
    required: true,
    schema: {
      type: "string",
    },
  },
};

export default headers;
