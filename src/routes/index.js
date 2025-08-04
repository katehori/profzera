const express = require('express');
const router = express.Router();
const postRoutes = require('./postRoutes');

const routes = db => {
  router.get('/health', async (req, res) => {
    try {
      await db.query('SELECT 1');
      res.status(200).json({
        status: 'OK',
        db: 'Conectado!'
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        db: 'Desconectado'
      });
    }
  });
  router.use('/posts', postRoutes);

  return router;
};

module.exports = routes;