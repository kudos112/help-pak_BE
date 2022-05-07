const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createMedicalCamp = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required(),
    city: Joi.string().required(),
    fullAddress: Joi.string().required(),
    organizerName: Joi.string().required(),
    organizerEmail: Joi.string().required().email(),
    organizerId: Joi.number().integer().required(),
    phoneNo: Joi.number().integer().required(),
    description: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    scheduledDays: Joi.array().required(),
    images: Joi.array().required(),
  }),
};

const getMedicalCamps = {
  query: Joi.object().keys({
    organizerName: Joi.string(),
    organizerId: Joi.number().integer(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProviderMedicalCamps = {
  params: Joi.object().keys({
    organizerId: Joi.number(),
  }),
};

const getMedicalCamp = {
  params: Joi.object().keys({
    campId: Joi.string().custom(objectId),
  }),
};

const verifyMedicalCamp = {
  params: Joi.object().keys({
    campId: Joi.string().custom(objectId),
  }),
};

const updateMedicalCamp = {
  params: Joi.object().keys({
    campId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      organizerEmail: Joi.string().email(),
      password: Joi.string().custom(password),
      organizerName: Joi.string(),
      name: Joi.string(),
    })
    .min(1),
};

const deleteMedicalCamp = {
  params: Joi.object().keys({
    campId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createMedicalCamp,
  getMedicalCamps,
  getProviderMedicalCamps,
  getMedicalCamp,
  updateMedicalCamp,
  verifyMedicalCamp,
  deleteMedicalCamp,
};
