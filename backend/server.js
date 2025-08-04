// const express = require('express');
// const bodyParser = require('body-parser');
// require('dotenv').config();

// const healthRoute = require('./src/controllers/HealthRoute');
// const postsRoute = require('./src/controllers/Post');
// const errorHandler = require('./src/config/errorHandler');
// const requestLogger = require('./src/config/requestLogger');
// const { pool, configure } = require('./config/dbConfig')

// const app = express();
// const PORT = process.env.PORT || 8080;

// // view engine setup
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(requestLogger);

// app.use('/', healthRoute);
// app.use('/', postsRoute)

// app.use(errorHandler);

// app.listen(PORT, async () => {
//   console.log(`Server is running on port ${PORT}`);
//   await configure(pool)
// })

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const setupSwagger = require('./config/swagger');

const app = express();
setupSwagger(app);

app.use(cors());
app.use(express.json());

// Test DB connection
app.get('/health', async (req, res) => {
  try {
    const db = require('../db');
    await db.raw('SELECT 1');
    res.status(200).json({
        status: 'OK',
        db: 'Conectado!'
    });
  } catch (error) {
    res.status(500).json({
        status: 'Error',
        db: 'Desconectado'
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});