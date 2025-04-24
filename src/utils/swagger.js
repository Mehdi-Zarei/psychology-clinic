const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Psychology Clinic REST API Document",
    version: "1.0.0",
    description:
      "This REST API is designed for a comprehensive Psychology Clinic management system built with Node.js. The platform allows psychologists to register, manage their availability, and open time slots for consultations. Users can browse available sessions, book appointments, and receive SMS notifications for both their own bookings and those of the psychologists. The API integrates secure OTP-based authentication for users, and includes a robust session management system that tracks consultations, user feedback, and sends timely reminders. The system is equipped with features like article management for psychological content, multi-level user management (psychologists, users), and seamless communication for bookings and session updates, ensuring an efficient and user-friendly experience.",
  },

  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      accessToken: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = { swaggerDefinition, apis: ["./docs/V1/*.yaml"] };

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
