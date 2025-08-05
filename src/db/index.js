const { Pool } = require('pg');

const getDbConfig = () => {
  // If DATABASE_URL (Render) exists, use as priority
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' 
        ? { 
            rejectUnauthorized: false
          } 
        : false,
      // Production optimizations:
      ...(process.env.NODE_ENV === 'production' && {
        poolSize: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      })
    };
  }

  // Default local configuration
  return {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "profzera_db",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: false
  };
};

const pool = new Pool(getDbConfig());

// Connection test
const testConnection = async pool => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT NOW() as current_time, current_database() as db_name');
    console.log(`PostgreSQL conectado | DB: ${rows[0].db_name} | Hora: ${rows[0].current_time}`);
  } finally {
    client.release();
  }
};

// Run test only if not in test (Jest/Mocha)
if (process.env.NODE_ENV !== 'test') {
  testConnection(pool)
    .catch(err => {
      console.error('Erro na conexão com PostgreSQL:', {
        message: err.message,
        code: err.code,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
      // Closes the application if it fails to connect
      process.exit(1);
    })
}

// Export with improved error handling
module.exports = {
  query: async (text, params) => {
    console.debug(`Executando query: ${text.substring(0, 50)}...`);
    return await pool.query(text, params).catch(err => {
      console.error('Erro na query:', {
        query: text,
        params,
        error: err.message,
        stack: err.stack
      });
    });
  },
  // For advanced transactions
  pool
};
