exports.up = function(knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.string('author').notNullable();
    table.boolean('is_published').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes to optimize searches
    table.index(['title'], 'idx_posts_title');
    table.index(['author'], 'idx_posts_author');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts');
};
