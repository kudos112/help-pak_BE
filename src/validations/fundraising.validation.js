const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createFundraising = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    reasonForFundraising: Joi.string().required(),
    description: Joi.string().required(),
    email: Joi.string().required().email(),
    city: Joi.string().required(),
    fullAddress: Joi.string().required(),
    phoneNo: Joi.number().integer().required(),
    paymentMethods: Joi.array().min(0).required(),
    images: Joi.array().required(),
  }),
};

const getFundraisings = {
  query: Joi.object().keys({
    organizerName: Joi.string(),
    organizerId: Joi.number().integer(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    enabled: Joi.boolean(),
    deleted: Joi.boolean(),
    new: Joi.boolean(),
    city: Joi.string().allow(""),
    reasonForFundraising: Joi.string().allow(""),
    name: Joi.string().allow(""),
  }),
};

const getProviderFundraisings = {
  params: Joi.object().keys({
    organizerId: Joi.number(),
  }),
};

const getFundraising = {
  params: Joi.object().keys({
    fundraisingId: Joi.string().custom(objectId),
  }),
};

const verifyFundraising = {
  params: Joi.object().keys({
    fundraisingId: Joi.string().custom(objectId),
  }),
};

const disableFundraising = {
  params: Joi.object().keys({
    fundraisingId: Joi.string().custom(objectId),
  }),
};

const updateFundraising = {
  params: Joi.object().keys({
    fundraisingId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().optional().email(),
      city: Joi.string().optional(),
      fullAddress: Joi.string().optional(),
      organizerName: Joi.string().optional(),
      organizerEmail: Joi.string().optional().email(),
      phoneNo: Joi.number().integer().optional(),
      description: Joi.string().optional(),
      paymentMethods: Joi.array().min(1).optional(),
      images: Joi.array().optional(),
    })
    .min(1),
};

const deleteFundraising = {
  params: Joi.object().keys({
    fundraisingId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createFundraising,
  getFundraisings,
  getProviderFundraisings,
  getFundraising,
  updateFundraising,
  verifyFundraising,
  disableFundraising,
  deleteFundraising,
};
