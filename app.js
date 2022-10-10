const config = require('./helpers/config');
const express = require('express');
const middleware = require('./helpers/middleware');
const logger = require('./helpers/logger');
const mongoose = require('mongoose');

const app = express();
const todoRouter = require('./controllers/todo');

logger.info('Connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connection to MongoDB ~', error.message);
  });


app.use(express.json());
app.use(middleware.requestLogger);
app.use('/', todoRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;