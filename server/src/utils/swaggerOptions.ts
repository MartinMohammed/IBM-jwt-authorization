import swaggerJSDoc from "swagger-jsdoc";
import schemas from "./swagger/schemas";
import responses from "./swagger/responses";
import securitySchemes from "./swagger/securitySchemes";
import headers from "./swagger/headers";
import links from "./swagger/links";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API documentation",
      version: "1.0.0",
      contact: {
        name: "Martin Mohammed",
        url: "martin-mohammed.info",
        email: "martinbusiness04@gmail.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/`,
      },
    ],
    components: {
      schemas,
      responses,
      securitySchemes,
      headers,
      links,
    },
  },
  apis: ["./src/routers/*.ts", "./models/*.ts"], // files containing annotations as above
};

export default swaggerOptions;
