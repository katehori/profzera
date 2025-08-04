const PostService = require("../service/Post");
const express = require('express');
const router = express.Router();

router.get('/posts', (_, res) => {
  res.status(200).json(PostService.findAll());
});

module.exports = router;
