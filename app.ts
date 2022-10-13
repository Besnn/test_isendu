import config from './helpers/config';
import express from 'express';
import middleware from './helpers/middleware';
import logger from './helpers/logger';
import mongoose from 'mongoose';
import todoRouter from './controllers/todo';

const app = express();


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

export default app;