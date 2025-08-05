const db = require('../db');

exports.health = async (req, res) => {
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
}