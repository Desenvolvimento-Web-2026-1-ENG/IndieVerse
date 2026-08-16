import swaggerJSDoc from 'swagger-jsdoc';

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}/api/v1`;

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pocket Store API - Jogos Independentes',
      version: '1.0.0',
      description: 'API RESTful para Marketplace de jogos independentes com suporte a carrinho, checkout, biblioteca de licenças e avaliações.',
    },
    servers: [
      {
        url: BASE_URL,
        description: 'Servidor Local da API',
      },
    ],
  },
  apis: ['./src/infrastructure/http/routes/*.ts', './src/http/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);