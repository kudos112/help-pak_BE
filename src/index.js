const mongoose = require('mongoose');
const { socketsServer } = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
// if ( process.env.NODE_ENV === 'production' )
let url = config.mongoose.url;
// else url = config.mongoose.dev_url;
mongoose.connect(url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = socketsServer.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
