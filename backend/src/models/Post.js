class Post {
  constructor(knex) {
    this.knex = knex;
  }

  // getAll (PUBLIC)
  async getAll() {
    return this.knex('posts')
      .where('is_published', true)
      .select('id', 'title', 'author', 'created_at');
  }

  // getById
  async getById(id) {
    return this.knex('posts')
      .where({ id, is_published: true })
      .first();
  }

  // create
  async create({ title, content, author }) {
    return this.knex('posts')
      .insert({ title, content, author })
      .returning('*');
  }

  // update
  async update(id, { title, content }) {
    return this.knex('posts')
      .where({ id })
      .update({ 
        title, 
        content,
        updated_at: this.knex.fn.now() 
      })
      .returning('*');
  }

  // getAllAdmin - List all posts as admin (teachers)
  async getAllAdmin() {
    return this.knex('posts')
      .select('*');
  }

  // delete
  async delete(id) {
    return this.knex('posts')
      .where({ id })
      .del();
  }

  // search by term
  async search(term) {
    return this.knex('posts')
      .where('is_published', true)
      .andWhere(function() {
        this.where('title', 'ilike', `%${term}%`)
          .orWhere('content', 'ilike', `%${term}%`);
      })
      .select('id', 'title', 'author', 'created_at');
  }
}

module.exports = Post;
