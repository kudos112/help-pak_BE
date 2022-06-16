const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createNgo = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    ngoRegNo: Joi.number().required(),
    ngoAuthenticationCertificationImage: Joi.array().required(),
    description: Joi.string().required(),
    vision: Joi.string().required(),
    ourMission: Joi.string().required(),
    background: Joi.string().required(),
    quickLinks: Joi.array().min(0).required(),
    followUs: Joi.array().min(0).required(),
    personsPost: Joi.array().min(0).required(),
    whatWeDo: Joi.array().min(0).required(),
    whoWeAre: Joi.string().required(),
    ourPartners: Joi.array().min(0).required(),
    images: Joi.array().required(),
  }),
};

const getNgos = {
  query: Joi.object().keys({
    ownerName: Joi.string(),
    ownerId: Joi.number().integer(),
    name: Joi.string(),
    description: Joi.string(),
    vision: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    enabled: Joi.boolean(),
    deleted: Joi.boolean(),
  }),
};

const getProviderNgos = {
  params: Joi.object().keys({
    ownerId: Joi.number(),
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
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    vision: Joi.string().optional(),
    ngoPhoneNo: Joi.number().optional(),
    email: Joi.string().optional().email(),
    quickLinks: Joi.array().min(1).optional(),
    followUs: Joi.array().min(1).optional(),
    personsPost: Joi.array().min(1).optional(),
    whatWeDo: Joi.array().min(1).optional(),
    ourPartners: Joi.array().min(1).optional(),
    images: Joi.array().required(),
    })
    .min(1),
};

const deleteNgo = {
  params: Joi.object().keys({
    ngoId: Joi.string().custom(objectId),
  }),
};

const disableNgo = {
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
  disableNgo,
  getProviderNgos,
  deleteNgo,
  verifyNgo,
};
