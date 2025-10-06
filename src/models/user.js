const db = require('../db');

const User = {
  // POST /login
  login: async ({ username, password }) => {
    const result = await db.query(`
      SELECT id, username, type 
      FROM users 
      WHERE username = $1 
        AND password = $2`,
      [username, password]
    );
    return result.rows[0] ?? null;
  },

  // GET /users
  getAllUsers: async () => {
    const result = await db.query(`
      SELECT id, username, type 
      FROM users 
      ORDER BY id DESC`
    );
    return result.rows;
  },

  // POST /users
  createUser: async ({ username, password, type }) => {
    const result = await db.query(`
      INSERT INTO users (username, password, type) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, type`,
      [username, password, type]
    );
    return result.rows[0] ?? null;
  },

  // GET /users/:id
  getUserById: async id => {
    const result = await db.query(`
      SELECT id, username, type 
      FROM users 
      WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  // PUT /users/:id
  updateUser: async (id, { password }) => {
    const result = await db.query(`
      UPDATE users
      SET password = $1 
      WHERE id = $2 
      RETURNING id, username, type`,
      [password, id]
    );
    return result.rows[0] ?? null;
  },

  // DELETE /users/:id
  deleteUserById: async id => {
    const result = await db.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    return result.rowCount;
  }
};

module.exports = User;
