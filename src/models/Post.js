const db = require('../db');

const Post = {

  // GET /posts
  getAllPosts: async () => {
    const result = await db.query('SELECT * FROM post ORDER BY id DESC');
    console.log(result);
    return result.rows;
  },

  // GET /posts/:id
  getPostById: async id => {
    const result = await db.query('SELECT * FROM post WHERE id = $1', [id]);
    console.log(result);
    return result.rows[0] ?? null;
  },

  // POST /posts
  createPost: async ({ title, content, author }) => {
    const result = await db.query(
      'INSERT INTO post (title, author, content) VALUES ($1, $2, $3) RETURNING *',
      [title, author, content]
    );
    console.log(result);
    return result.rows[0] ?? null;
  },

  // PUT /posts/:id
  updatePost: async (id, { title, content }) => {
    const result = await db.query(
      'UPDATE post SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    console.log(result);
    return result.rows[0] ?? null;
  },

  // DELETE /posts/:id
  deletePost: async id => {
    const result = await db.query('DELETE FROM post WHERE id = $1', [id]);
    console.log(result);
    return result.rowCount;
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
