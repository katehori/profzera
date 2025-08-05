const db = require('../db');

const Post = {

  // GET /posts
  getAllPosts: async () => {
    const result = await db.query('SELECT * FROM post ORDER BY id DESC');
    return result.rows;
  },

  // GET /posts/:id
  getPostById: async id => {
    const result = await db.query('SELECT * FROM post WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },

  // POST /posts
  createPost: async ({ title, content, author }) => {
    const result = await db.query(
      'INSERT INTO post (title, author, content) VALUES ($1, $2, $3) RETURNING *',
      [title, author, content]
    );
    return result.rows[0] ?? null;
  },

  // PUT /posts/:id
  updatePost: async (id, { title, content }) => {
    const result = await db.query(
      'UPDATE post SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    return result.rows[0] ?? null;
  },

  // DELETE /posts/:id
  deletePostById: async id => {
    const result = await db.query('DELETE FROM post WHERE id = $1', [id]);
    return result.rowCount;
  },

  // GET /posts/search
  searchPosts: async keywords => {
    const result = await db.query('SELECT * FROM post WHERE searchable_text @@ to_tsquery($1)', [keywords.join(' | ')]);
    return result.rows;
  }
}

module.exports = Post;
