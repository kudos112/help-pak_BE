const httpStatus = require('http-status');
const { emailService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const sendContactUsEmail = catchAsync(async (req, res) => {
  await emailService.sendContactUsEmail(req.body.email, req.body.name, req.body.message);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  sendContactUsEmail,
};
