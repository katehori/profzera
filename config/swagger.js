const YAML = require('yamljs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const openapiPath = path.join(__dirname, '../docs/openapi.yaml');
const specs = YAML.load(openapiPath);

// Adicione exemplos dinâmicos se necessário
specs.components.examples = {
  PostExample: {
    value: {
      id: 1,
      title: "Exemplo de post",
      content: "Conteúdo detalhado...",
      author: "Prof. Nome e Sobrenome"
    }
  }
};

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.get('/openapi.json', (req, res) => res.json(specs));
};