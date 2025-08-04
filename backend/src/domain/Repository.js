const pool = require("./config/dbConfig");

const repository = {
    findAll: async () =>
        await pool.query('SELECT * FROM posts ORDER BY id DESC').rows,
    findById: async (id) =>
        await pool.query('SELECT * FROM posts WHERE id = ?', [id]).rows[0] ?? null,
    insert: async (title, author, content) =>
        await pool.query('INSERT INTO posts (title, author, content) VALUES (?, ?, ?) RETURNING *', [title, author, content]).rows[0] ?? null,
    updateById: async (id, title, author, content) =>
        await pool.query('UPDATE posts SET title = ?, author = ?, content = ? WHERE id = ? RETURNING *', [title, author, content, id]).rows[0] ?? null,
    deleteById: async (id) =>
        await pool.query('DELETE FROM posts WHERE id = ?', [id]).rowCount,
}

module.exports = repository