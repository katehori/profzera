const { Pool } = require('pg');

console.log("Creating Database pool...");
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
console.log("Database pool created.");

const configure = async pool => {
    console.log("Establishing connection to DB...");
    await establishDBConnection(pool);
    console.log("Connection established to DB.");

    const results = await pool.query(`SELECT NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'post'
    ) as post_table_does_not_exist`);
    const shouldAttemptDBMigration = results.rows[0].post_table_does_not_exist;

    if (shouldAttemptDBMigration) {
        console.log("Attempting initial database migration...");
        await attemptDBMigration(pool);
        console.log("Concluded initial database migration attempt.");
    } else {
        console.log('Skipping initial database migration.')
    }

    pool.on("error", (err) => {
        console.error("Failed to execute DB command:", err);
    })
    return pool;
}

const establishDBConnection = async pool => {
    try {
        console.log("Attempting sample query...");
        const result = await pool.query('SELECT 1 as connected');
        console.log(`Sample query result: ${JSON.stringify(result)} (RAW ${result}`);
    } catch (err) {
        console.error("Failed to establish DB connection:", err);
        throw err;
    }
};

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
            searchabletext TSVECTOR
        )`);
        if (results) {
            console.log("Successfully created 'post' table.");
        }

        results = await client.query(`UPDATE post 
            SET searchabletext = (to_tsvector('portuguese', title || '' || content))`)
        if (results) {
            console.log("Successfully set 'searchabletext' column in 'post' table to tsvector.");
        }

        results = await client.query(`CREATE INDEX post_text_search_idx 
            ON post
            USING GIN (searchabletext)`)
        if (results) {
            console.log("Successfully created GIN index on 'searchabletext' column in 'post' table.");
        }
        client.query('COMMIT')
    } catch (e) {
        console.error("Failed to execute initial migration:", e);
        throw e;
    } finally {
        client.release();
    }
};

module.exports = {
    pool,
    configure,
};