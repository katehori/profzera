const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// TODO FIX NO AUTH MIDDLEWARE
// const { authenticate, authorize } = require('../middlewares/auth');


// Public routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// TODO: FIX KNEX
// router.get('/search', postController.searchPosts);

// Protected routes for teachers
router.post('/',
  // TODO FIX NO AUTH MIDDLEWARE
  // authenticate,
  // authorize('teacher'),
  postController.createPost
);

router.put('/:id',
  // TODO FIX NO AUTH MIDDLEWARE
  // authenticate,
  // authorize('teacher'),
  postController.updatePost
);

router.delete('/:id',
  // TODO FIX NO AUTH MIDDLEWARE
  // authenticate,
  // authorize('teacher'),
  postController.deletePost
);

// Route admin to see all posts
// TODO: Not used, FIX KNEX
// router.get('/admin/all',
  // TODO FIX NO AUTH MIDDLEWARE
  // authenticate,
  // authorize('admin'),
  // postController.listAllPosts
// );

module.exports = router;
