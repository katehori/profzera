const express = require('express');
const router = express.Router();

const PostController = require('../controllers/postController');
const { authenticate, authorize } = require('../middlewares/auth');

module.exports = (knex) => {
  const postController = new PostController(knex);

  // Public routes
  router.get('/', postController.listPosts.bind(postController));
  router.get('/:id', postController.getPost.bind(postController));
  router.get('/search', postController.searchPosts.bind(postController));

  // Protected routes for teachers
  router.post('/', 
    authenticate, 
    authorize('teacher'), 
    postController.createPost.bind(postController)
  );
  
  router.put('/:id', 
    authenticate, 
    authorize('teacher'), 
    postController.updatePost.bind(postController)
  );
  
  router.delete('/:id', 
    authenticate, 
    authorize('teacher'), 
    postController.deletePost.bind(postController)
  );

  // Route admin to see all posts
  router.get('/admin/all', 
    authenticate, 
    authorize('admin'), 
    postController.listAllPosts.bind(postController)
  );

  return router;
};
