class Post {
  constructor(db) {
    this.db = db;
  }

  // getAll (PUBLIC)
  async getAll() {
    const newVar = await this.db.query('SELECT * FROM post ORDER BY id DESC');
    return newVar.rows;
  }

  // getById
  async getById(id) {
    return await this.db.query('SELECT * FROM post WHERE id = ?', [id]).rows[0] ?? null;
  }

  // create
  async create({ title, content, author }) {
    return await this.db.query(
      'INSERT INTO post (title, author, content) VALUES (?, ?, ?) RETURNING *',
      [title, author, content]
    ).rows[0] ?? null;
  }

  // update
  async update(id, { title, content }) {
    return await this.db.query(
      'UPDATE post SET title = ?, content = ? WHERE id = ? RETURNING *',
      [title, content, id]
    ).rows[0] ?? null;
  }

  // TODO: FIX KNEX
  // getAllAdmin - List all posts as admin (teachers)
  // async getAllAdmin() {
  //   return this.knex('posts')
  //     .select('*');
  // }

  // delete
  async delete(id) {
    return await this.db.query('DELETE FROM post WHERE id = ?', [id]).rowCount;
  }

  // TODO: FIX KNEX
  // search by term
  // async search(term) {
  //   return this.knex('posts')
  //     .where('is_published', true)
  //     .andWhere(function() {
  //       this.where('title', 'ilike', `%${term}%`)
  //         .orWhere('content', 'ilike', `%${term}%`);
  //     })
  //     .select('id', 'title', 'author', 'created_at');
  // }
}

module.exports = Post;
