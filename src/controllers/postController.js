const PostModel = require('../models/Post')

// GET /posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar todos os posts'
    });
  }
}

// GET /posts/:id
exports.getPostById = async (req, res) => {
  const id = req.params.id

  try {
    const postById = await PostModel.getPostById(id);

    if (!postById) return res.status(404).json({
      error: 'Post não encontrado'
    });

    res.status(200).json(postById);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar post'
    });
  }
}

// POST /posts
exports.createPost = async (req, res) => {
  const { title, content, author } = req.body;

  try {
    const newPost = await PostModel.createPost({ title, content, author });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar post'
    });
  }
}

// PUT /posts/:id
exports.updatePost = async (req, res) => {
  const id = req.params.id
  const { title, content } = req.body

  try {
    const updatedPost = await PostModel.updatePost(id, { title, content });

    if (!updatedPost) return res.status(404).json({
      error: 'Post não encontrado'
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao atualizar post'
    });
  }
}

// DELETE /posts/:id
exports.deletePostById = async (req, res) => {
  const id = req.params.id

  try {
    const post = await PostModel.deletePostById(id);

    if (!post) return res.status(404).json({
      error: 'Post não encontrado'
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao deletar post'
    });
  }
}

// GET /posts/search
// TODO: FIX KNEX
// exports.searchPosts = async (req, res) => {
//   try {
//     const { term: searchTerm } = req.query;
//     if (!searchTerm) return res.status(400).json({
//       error: 'Termo de busca necessário'
//     });
//
//     const results = await PostModel.searchPosts(searchTerm);
//     res.json(results);
//   } catch (error) {
//     res.status(500).json({
//       error: 'Erro na busca'
//     });
//   }
// }

// listAllPosts (ADMIN)
// TODO: Not used, FIX KNEX
// exports.listAllPosts = async (req, res) => {
//   try {
//     const posts = await PostModel.getAllAdmin();
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({
//       error: 'Erro ao buscar posts'
//     });
//   }
// }
