import swaggerJSDoc from "swagger-jsdoc";
import { auth } from "telegram/client";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next.js API Documentation",
      version: "1.0.0",
      description: "API docs for testing backend APIs"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

    security: [
      {
        BearerAuth: []
      }
    ],
    paths: {
      "/api/google/calendar": {
        post: {
          summary: "Create Google Calendar Event",
          tags: ["Google Calendar"],
          security: [
            {
              BearerAuth: []
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["summary", "startTime", "endTime"],
                  properties: {
                    summary: { type: "string" },
                    description: { type: "string" },
                    attendees: {
                      type: "array",
                      items: {
                        type: "string",
                        format: "email"
                      }
                    },
                    isMeetRequired: {
                      type: "boolean",
                      description: "Whether to add Google Meet conferencing"
                    },
                    startTime: {
                      type: "string",
                      example: "2025-01-10T16:00:00"
                    },
                    endTime: {
                      type: "string",
                      example: "2025-01-10T16:30:00"
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Event created"
            }
          }
        }
      }
    }
  },
  apis: [] // ✅ No need to specify files since paths are defined inline
});
