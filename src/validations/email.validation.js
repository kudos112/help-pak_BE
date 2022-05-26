const Joi = require('joi');

const sendContactUsEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    message: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

module.exports = {
  sendContactUsEmail,
};
