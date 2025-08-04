const express = require('express');
const router = express.Router();

/* GET Health check. */
router.get('/health', (_, res) => {
  res.status(200).json({status: 'UP'});
});

module.exports = router;
