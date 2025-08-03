const express = require('express');
const router = express.Router();

module.exports = (knex) => {
  // Import all routes
  const postRoutes = require('./postRoutes')(knex);
  
  // Configure the routes
  router.use('/posts', postRoutes);
  
  return router;
};