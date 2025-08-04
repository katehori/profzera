const express = require('express');
const router = express.Router();

const PostController = require('../controllers/postController');
// TODO FIX NO AUTH MIDDLEWARE
// const { authenticate, authorize } = require('../middlewares/auth');

const postRoutes = db => {
  const postController = new PostController(db);

  // Public routes
  router.get('/', postController.listPosts.bind(postController));
  router.get('/:id', postController.getPostById.bind(postController));

  // TODO: FIX KNEX
  // router.get('/search', postController.searchPosts.bind(postController));

  // Protected routes for teachers
  router.post('/',
    // TODO FIX NO AUTH MIDDLEWARE
    // authenticate,
    // authorize('teacher'),
    postController.createPost.bind(postController)
  );

  router.put('/:id',
    // TODO FIX NO AUTH MIDDLEWARE
    // authenticate,
    // authorize('teacher'),
    postController.updatePost.bind(postController)
  );

  router.delete('/:id',
    // TODO FIX NO AUTH MIDDLEWARE
    // authenticate,
    // authorize('teacher'),
    postController.deletePost.bind(postController)
  );

  // Route admin to see all posts
  // TODO: Not used, FIX KNEX
  // router.get('/admin/all',
    // TODO FIX NO AUTH MIDDLEWARE
    // authenticate,
    // authorize('admin'),
    // postController.listAllPosts.bind(postController)
  // );

  return router;
};

module.exports = postRoutes;
