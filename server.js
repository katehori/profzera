require('dotenv').config();
const cors = require('cors');
const express = require('express');
const postRoutes = require('./src/routes/postRoutes');
const healthRoutes = require('./src/routes/healthRoutes');
const migrations = require('./src/migrations');
const db = require('./src/db');
const setupSwagger = require('./config/swagger');

const app = express();
const PORT = process.env.NODE_PORT || 8080;

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use('/api/', healthRoutes)
app.use('/api/posts', postRoutes)

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await migrations(db)
});