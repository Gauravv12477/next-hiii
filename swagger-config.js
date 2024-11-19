const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Next.js API Documentation",
    version: "1.0.0",
    description: "API documentation for the Next.js application",
  },
  servers: [
    {
      url: "http://localhost:3000/api", // Base URL for API endpoints
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./pages/api/**/*.ts"], // Path to your API handlers
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
