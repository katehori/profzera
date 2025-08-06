require('dotenv').config();
const cors = require('cors');
const express = require('express');

const requestLogger = require("./config/requestLogger");
const setupSwagger = require('./config/swagger');
const migrations = require('./src/migrations');

const postRoutes = require('./src/routes/postRoutes');
const healthRoutes = require('./src/routes/healthRoutes');
const db = require('./src/db');

const app = express();
const PORT = process.env.NODE_PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

setupSwagger(app);

app.use('/api/', healthRoutes)
app.use('/api/posts', postRoutes)

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await migrations(db)
});