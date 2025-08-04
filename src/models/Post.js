const db = require('../db');

class Post {
  // GET /posts
  async getAllPosts() {
    const allPosts = await db.query('SELECT * FROM post ORDER BY id DESC');
    return allPosts.rows;
  }

  // GET /posts/:id
  async getPostById(id) {
    return await db.query('SELECT * FROM post WHERE id = ?', [id]).rows[0] ?? null;
  }

  // POST /posts
  async createPost({ title, content, author }) {
    return await db.query(
      'INSERT INTO post (title, author, content) VALUES (?, ?, ?) RETURNING *',
      [title, author, content]
    ).rows[0] ?? null;
  }

  // PUT /posts/:id
  async updatePost(id, { title, content }) {
    return await db.query(
      'UPDATE post SET title = ?, content = ? WHERE id = ? RETURNING *',
      [title, content, id]
    ).rows[0] ?? null;
  }

  // DELETE /posts/:id
  async deletePost(id) {
    return await db.query('DELETE FROM post WHERE id = ?', [id]).rowCount;
  }

  // GET /posts/search
  // TODO: FIX KNEX
  // async searchPosts(term) {
  //   return this.knex('posts')
  //     .where('is_published', true)
  //     .andWhere(function() {
  //       this.where('title', 'ilike', `%${term}%`)
  //         .orWhere('content', 'ilike', `%${term}%`);
  //     })
  //     .select('id', 'title', 'author', 'created_at');
  // }

  // TODO: FIX KNEX
  // getAllAdmin - List all posts as admin (teachers)
  // async getAllAdmin() {
  //   return this.knex('posts')
  //     .select('*');
  // }
}

module.exports = Post;
