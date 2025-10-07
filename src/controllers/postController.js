const PostModel = require('../models/post')
const UserModel = require('../models/user')
const { postErrors, userErrors } = require("../constants/errorMessages");

// GET /posts/search
exports.searchPosts = async (req, res) => {
  const { term: searchTerm } = req.query;

  if (!searchTerm?.trim())
    return res.status(400).json({ error: postErrors.MISSING_KEYWORD });

  try {
    const keywords = searchTerm.split(' ').filter(Boolean);
    const results = await PostModel.searchPosts(keywords);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: postErrors.KEYWORD_SEARCH_ERROR });
  }
}

// GET /posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: postErrors.FIND_ALL_ERROR });
  }
}

// POST /posts
exports.createPost = async (req, res) => {
  const { title, content, userId } = req.body;

  if (!title?.trim() || !content?.trim() || userId == null)
    return res.status(400).json({ error: postErrors.MISSING_CREATE_DATA })

  if (!await UserModel.getUserById(userId))
    return res.status(400).json({ error: userErrors.NOT_FOUND })

  try {
    const newPost = await PostModel.createPost({ title, content, userId });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: postErrors.CREATE_ERROR });
  }
}

// GET /posts/:id
exports.getPostById = async (req, res) => {
  const id = req.params.id

  try {
    const postById = await PostModel.getPostById(id);

    if (!postById)
      return res.status(404).json({ error: postErrors.NOT_FOUND });

    res.status(200).json(postById);
  } catch (error) {
    res.status(500).json({ error: postErrors.FIND_BY_ID_ERROR });
  }
}

// PUT /posts/:id
exports.updatePost = async (req, res) => {
  const id = req.params.id
  const { title, content } = req.body

  if (!title?.trim() || !content?.trim())
    return res.status(400).json({ error: postErrors.MISSING_UPDATE_DATA })

  try {
    const updatedPost = await PostModel.updatePost(id, { title, content });

    if (!updatedPost)
      return res.status(404).json({ error: postErrors.NOT_FOUND });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: postErrors.UPDATE_ERROR });
  }
}

// DELETE /posts/:id
exports.deletePostById = async (req, res) => {
  const id = req.params.id

  try {
    const post = await PostModel.deletePostById(id);

    if (!post)
      return res.status(404).json({ error: postErrors.NOT_FOUND });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: postErrors.DELETE_ERROR });
  }
}
