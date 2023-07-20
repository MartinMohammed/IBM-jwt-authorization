const securitySchemes = {
  bearerAuth: {
    // arbitrary name for the security schmeme
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT", // optional, arbitrary value for documentation purposes
  },
};
export default securitySchemes;
