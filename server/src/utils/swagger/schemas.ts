const schemas = {
  GeneralError: {
    type: "object",
    properties: {
      message: {
        type: "string",
      },
      statusCode: {
        type: "integer",
        format: "int32",
        min: 100,
        max: 600,
      },
    },
    minProperties: 2,
    maxProperties: 2,
  },
  RegisterAndLoginRequestBody: {
    type: "object",
    properties: {
      email: {
        type: "string",
        example: "example@example.com",
        // Used in POST, not returned by GET
        // rite-only required properties – to requests only.
        writeOnly: true,
        // Tools can use the format to validate the input or to map the value to a specific type in the chosen programming language
        format: "email",
      },
      password: {
        min: 4,
        type: "string",
        // Used in POST, not returned by GET
        writeOnly: true,
        example: "<YOUR-SECURE-PASSSWORD>",
        format: "password",
      },
    },
    minProperties: 2,
    maxProperties: 2,
    required: ["email", "password"],
  },
};

export default schemas;
