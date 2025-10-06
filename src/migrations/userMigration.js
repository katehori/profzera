const userResourcesMigration = async client => {
  const results = await client.query(`
    CREATE TABLE users (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        type SMALLINT NOT NULL CHECK (type BETWEEN 0 AND 2)
    )`);
  if (results) {
    console.log("Successfully created 'users' table.");
  }
};

module.exports = userResourcesMigration;