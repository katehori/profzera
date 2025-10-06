const postResourcesMigration = async client => {
  let results = await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm');
  if (results) {
    console.log('Successfully added extension for GIN.');

  }
  results = await client.query(`
    CREATE TABLE posts (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        user_id INT NOT NULL,
        searchable_text TSVECTOR GENERATED ALWAYS AS (
            to_tsvector('simple', title || ' ' || content)
        ) STORED,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
    )`);
  if (results) {
    console.log("Successfully created 'posts' table.");

  }
  results = await client.query(`
    CREATE INDEX post_text_search_idx 
        ON posts USING GIN (searchable_text)`)
  if (results) {
    console.log("Successfully created GIN index on 'searchable_text' column in 'posts' table.");
  }
};

module.exports = postResourcesMigration;