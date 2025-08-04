const Post = require('../models/Post');

class PostController {
  constructor(db) {
    this.postModel = new Post(db);
  }

  // listPosts (PUBLIC)
  async listPosts(req, res) {
    try {
      const posts = await this.postModel.getAll();
      res.json(posts);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao buscar posts'
      });
    }
  }

  // getPostById
  async getPostById(req, res) {
    try {
      const post = await this.postModel.getById(req.params.id);
      if (!post) return res.status(404).json({
        error: 'Post não encontrado'
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao buscar post'
      });
    }
  }

  // createPost (only for teachers)
  async createPost(req, res) {
    try {
      const { title, content, author } = req.body;
      const newPost = await this.postModel.create({ title, content, author });
      res.status(201).json(newPost);
    } catch (error) {
      res.status(400).json({
        error: 'Erro ao criar post'
      });
    }
  }

  // updatePost (only for teachers)
  async updatePost(req, res) {
    try {
      const updatedPost = await this.postModel.update(
        req.params.id, 
        req.body
      );
      if (!updatedPost) return res.status(404).json({
        error: 'Post não encontrado'
      });
      res.json(updatedPost);
    } catch (error) {
      res.status(400).json({
        error: 'Erro ao atualizar post'
      });
    }
  }

  // listAllPosts (ADMIN)
  // TODO: Not used, FIX KNEX
  // async listAllPosts(req, res) {
  //   try {
  //     const posts = await this.postModel.getAllAdmin();
  //     res.json(posts);
  //   } catch (error) {
  //     res.status(500).json({
  //       error: 'Erro ao buscar posts'
  //     });
  //   }
  // }

  // deletePost (only for teachers)
  async deletePost(req, res) {
    try {
      const deleted = await this.postModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({
        error: 'Post não encontrado'
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao deletar post'
      });
    }
  }

  // searchPosts
  // TODO: FIX KNEX
  // async searchPosts(req, res) {
  //   try {
  //     const { term: searchTerm } = req.query;
  //     if (!searchTerm) return res.status(400).json({
  //       error: 'Termo de busca necessário'
  //     });
  //
  //     const results = await this.postModel.search(searchTerm);
  //     res.json(results);
  //   } catch (error) {
  //     res.status(500).json({
  //       error: 'Erro na busca'
  //     });
  //   }
  // }
}

module.exports = PostController;
