require('dotenv').config();
const express = require('express');
const cors = require('cors');
const setupSwagger = require('./config/swagger');
const routes = require('./src/routes');
const migrations = require('./src/migrations');
const db = require('./src/db');

const app = express();
setupSwagger(app);

app.use(cors());
app.use(express.json());
app.use(routes(db))

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await migrations(db)
});