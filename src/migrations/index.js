const { migrationMap, tableNames } = require("./util");

const migrations = async db => {
  const results = await db.query(`
    SELECT tablename as existing_tables
    FROM pg_tables
    WHERE schemaname = 'public' 
      AND tablename = ANY($1)`,
    [tableNames]);
  const existingTables = new Set(results.rows.map(row => row.existing_tables));

  const missingTables = tableNames.filter(tableName => !existingTables.has(tableName))

  if (missingTables.length > 0) {
    console.log("Attempting initial database migration...");
    await attemptDBMigration(db.pool, missingTables);
    console.log("Concluded initial database migration attempt.");
  } else {
    console.log('Skipping initial database migration.')
  }
}

const attemptDBMigration = async (pool, tablesToMigrate) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN')
    for (const tableName of tablesToMigrate) {
      const migrateFunction = migrationMap.get(tableName)
      if (migrateFunction) {
        await migrateFunction(client);
      }
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