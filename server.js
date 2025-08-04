require('dotenv').config();
const express = require('express');
const postRoutes = require('./src/routes/postRoutes');
const migrations = require('./src/migrations');
const db = require('./src/db');
const cors = require('cors');
const setupSwagger = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 8080;

setupSwagger(app);

app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoutes())

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await migrations(db)
});