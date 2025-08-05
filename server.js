require('dotenv').config();
const cors = require('cors');
const express = require('express');
const postRoutes = require('./src/routes/postRoutes');
const healthRoutes = require('./src/routes/healthRoutes');
const migrations = require('./src/migrations');
const db = require('./src/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const PORT = process.env.NODE_PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/', healthRoutes)
app.use('/api/posts', postRoutes)

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentação das APIs do ProfZera backend',
      description: 'API completa para gestão de posts acadêmicos.',
      version: '1.0',
    },
    tags: [
      { name: 'post', description: 'Operações relacionadas a posts' },
    ],
    servers: [
      { url: 'http://localhost:8080', description: 'Servidor local' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await migrations(db)
});