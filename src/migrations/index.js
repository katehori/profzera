const migrations = async db => {
  const results = await db.query(`SELECT NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'post'
  ) as post_table_does_not_exist`);
  const shouldAttemptDBMigration = results.rows[0].post_table_does_not_exist;

  if (shouldAttemptDBMigration) {
    console.log("Attempting initial database migration...");
    await attemptDBMigration(db.pool);
    console.log("Concluded initial database migration attempt.");
  } else {
    console.log('Skipping initial database migration.')
  }
}

const attemptDBMigration = async pool => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN')
    let results = await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm');
    if (results) {
      console.log('Successfully added extension for GIN.');
    }

    results = await client.query(`CREATE TABLE post (
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author VARCHAR(50) NOT NULL,
      searchable_text TSVECTOR GENERATED ALWAYS AS (
          to_tsvector('simple', title || ' ' || content)
      ) STORED
    )`);
    if (results) {
      console.log("Successfully created 'post' table.");
    }

    results = await client.query(`CREATE INDEX post_text_search_idx 
      ON post
      USING GIN (searchable_text)`)
    if (results) {
      console.log("Successfully created GIN index on 'searchable_text' column in 'post' table.");
    }
    client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    console.error("Failed to execute initial migration:", e);
    throw e;
  } finally {
    client.release();
  }
};

module.exports = migrations;