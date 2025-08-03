require('dotenv').config();
const express = require('express');
const cors = require('cors');
const setupSwagger = require('./config/swagger');

const app = express();
setupSwagger(app);

app.use(cors());
app.use(express.json());

// Test DB connection
app.get('/health', async (req, res) => {
  try {
    const db = require('../db');
    await db.raw('SELECT 1');
    res.status(200).json({
        status: 'OK',
        db: '✅ Conectado!'
    });
  } catch (error) {
    res.status(500).json({
        status: 'Error',
        db: '❌ Desconectado'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});