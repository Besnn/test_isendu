import app from './app';
import http from 'http';
import config from './helpers/config';
import logger from './helpers/logger';

const server: http.Server = http.createServer(app);


server.listen(config.PORT, () => {
  logger.info(`Server backend running on port ${config.PORT}`);
});
