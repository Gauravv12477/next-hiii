const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0", // Specify OpenAPI version
    info: {
      title: "Next.js API", // API title
      version: "1.0.0", // API version
      description: "API documentation for the Next.js project", // Short description
    },
    servers: [
      {
        url: "http://localhost:3000/api", // Base URL for the API
      },
    ],
  },
  apis: ["./pages/api/**/*.ts"], // Path to the API handlers
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
