const express = require('express');
const bodyParser = require('body-parser');


const healthRoute = require('./controller/HealthRoute');
const postsRoute = require('./controller/PostController');
const errorHandler = require('./config/ErrorHandler');
const requestLogger = require('./config/RequestLogger');
const { pool, configure } = require('./config/DbConfig')

const app = express();
const PORT = process.env.PORT || 3000;

// view engine setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/', healthRoute);
app.use('/', postsRoute)

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await configure(pool)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});