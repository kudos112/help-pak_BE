const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createNgo = {
  body: Joi.object().keys({
    ngoName: Joi.string().required(),
    ngoRegistrationNo: Joi.number().required(),
    ngoAuthenticationCertificationImage: Joi.array().required(),
    ngoPhoneNo: Joi.number().required(),
    ngoEmail: Joi.string().required().email(),
    ngoPassword: Joi.string().required().custom(password),
    
 //   role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getNgos = {
  query: Joi.object().keys({
    ngoName: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getNgo = {
  params: Joi.object().keys({
    ngoId: Joi.string().custom(objectId),
  }),
};

const updateNgo = {
  params: Joi.object().keys({
    ngoId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      ngoEmail: Joi.string().email(),
      ngoPassword: Joi.string().custom(password),
      ngoName: Joi.string(),
    })
    .min(1),
};

const deleteNgo = {
  params: Joi.object().keys({
    ngoId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createNgo,
  getNgos,
  getNgo,
  updateNgo,
  deleteNgo,
};
