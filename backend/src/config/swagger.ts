import swaggerJsdoc from 'swagger-jsdoc';

import { env } from './env';

export const swaggerOptions: swaggerJsdoc.OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Agendei Experience API',
      version: '1.0.0',
      description: 'API for Agendei Experience - Service Marketplace',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Appointments',
        description: 'Appointment scheduling endpoints',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        Health: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            uptime: {
              type: 'number',
              example: 123.45,
            },
            environment: {
              type: 'string',
              example: 'development',
            },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts'],
};
