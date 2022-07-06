const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createNgo = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    city: Joi.string().required(),
    fullAddress: Joi.string().required(),
    regNo: Joi.number().required(),
    email: Joi.string().required().email(),
    phoneNo: Joi.string().required(),
    vision: Joi.string().required(),
    background: Joi.string().required(),
    images: Joi.array().required().min(1),
    founder: Joi.object()
      .keys({
        name: Joi.string().required(),
        picture: Joi.string().required(),
        message: Joi.string().optional(),
      })
      .required(),
    paymentMethods: Joi.array().min(1).required(),
  }),
};

const getNgos = {
  query: Joi.object().keys({
    name: Joi.string().allow('').allow(null),
    city: Joi.string().allow('').allow(null),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    published: Joi.boolean(),
    new: Joi.boolean(),
    deleted: Joi.boolean(),
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
  body: Joi.object().keys({
    email: Joi.string().email().optional(),
    phoneNo: Joi.string().optional(),
    vision: Joi.string().optional(),
    background: Joi.string().optional(),
    city: Joi.string().optional(),
    fullAddress: Joi.string().optional(),
    founder: Joi.object()
      .keys({
        name: Joi.string().optional(),
        picture: Joi.string().optional(),
        message: Joi.string().optional(),
      })
      .optional(),
  }),
};

const deleteNgo = {
  params: Joi.object().keys({
    ngoId: Joi.string().custom(objectId),
  }),
};

const verifyNgo = {
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
  verifyNgo,
};
