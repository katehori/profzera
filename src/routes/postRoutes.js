const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/search', postController.searchPosts);

router.get('/', postController.getAllPosts);

router.post('/', postController.createPost);

router.get('/:id', postController.getPostById);

router.put('/:id', postController.updatePost);

router.delete('/:id', postController.deletePostById);

module.exports = router;
