const db = require('../db');

const Post = {
  // GET /posts/search
  searchPosts: async keywords => {
    const result = await db.query(`
      SELECT p.id, p.title, p.content, p.user_id, u.username, u.type
      FROM posts p
      JOIN users u 
          ON p.user_id = u.id
      WHERE p.searchable_text @@ to_tsquery($1)`,
      [keywords.join(' | ')]
    );
    return result.rows;
  },

  // GET /posts
  getAllPosts: async () => {
    const result = await db.query(`
      SELECT p.id, p.title, p.content, p.user_id, u.username, u.type
      FROM posts p 
      JOIN users u
          ON p.user_id = u.id
      ORDER BY p.id DESC`
    );
    return result.rows;
  },

  // POST /posts
  createPost: async ({ title, content, user_id }) => {
    const result = await db.query(`
      INSERT INTO posts (title, user_id, content)
      VALUES ($1, $2, $3) 
      RETURNING *`,
      [title, user_id, content]
    );
    return result.rows[0] ?? null;
  },

  // GET /posts/:id
  getPostById: async id => {
    const result = await db.query(`
      SELECT p.id, p.title, p.content, p.user_id, u.username, u.type
      FROM posts p
      JOIN users u
          ON p.user_id = u.id
      WHERE p.id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  // PUT /posts/:id
  updatePost: async (id, { title, content }) => {
    const result = await db.query(`
      UPDATE posts 
      SET title = $1, content = $2 
      WHERE id = $3 
      RETURNING *`,
      [title, content, id]
    );
    return result.rows[0] ?? null;
  },


  // DELETE /posts/:id
  deletePostById: async id => {
    const result = await db.query(
      'DELETE FROM posts WHERE id = $1',
      [id]
    );
    return result.rowCount;
  }
};

module.exports = Post;