const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
//const { User } = require('./models');
const User = require('./models/user.model');
const MedicalAssistance = require('./models/medicalassistance.model');

let server;
let url = '';
if (process.env.NODE_ENV === 'production') url = config.mongoose.url;
else url = config.mongoose.dev_url;
mongoose.connect(url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
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

/////////////////////////////////
// const relation = async () => {
//   const medicalassistance = await MedicalAssistance.findById ('62473655f870b026f8f22dcf')
//   await medicalassistance.populate('provider').execPopulate()
//   console.log('no');
//   console.log(medicalassistance.provider)
//   console.log('no');
// }

// relation()
// /////////////////////////////////////////
// const relations = async () => {
//   const user = await User.findById ('624a602fb7ae9e362c733757')
//   await user.populate('medicalAssistanceDetail').execPopulate()
//   console.log('yes');
//   console.log(user.medicalAssistanceDetail)
//   console.log('yes');
// }

//  relations()
//////////////////////////////////

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
