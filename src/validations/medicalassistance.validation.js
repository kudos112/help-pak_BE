const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createMedicalAssistance = {
  body: Joi.object().keys({
    serviceType: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phoneNo: Joi.number().integer().required(),
    fullAddress: Joi.string().required(),
    city: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().optional(),
    startTime: Joi.string().optional(),
    endTime: Joi.string().optional(),
    fullDay: Joi.boolean().required(),
    workingDays: Joi.array().min(1).required(),
    images: Joi.array().min(1).required(),
  }),
};

const getMedicalAssistances = {
  query: Joi.object().keys({
    name: Joi.string().allow('').allow(null),
    serviceType: Joi.string().allow('').allow(null),
    city: Joi.string().allow('').allow(null),
    sortBy: Joi.string().allow('').allow(null),
    limit: Joi.number().integer().allow('').allow(null),
    page: Joi.number().integer().allow('').allow(null),
    enabled: Joi.boolean(),
    deleted: Joi.boolean(),
  }),
};

const getMedicalAssistance = {
  params: Joi.object().keys({
    medicalAssistanceId: Joi.string().custom(objectId),
  }),
};

const updateMedicalAssistance = {
  params: Joi.object().keys({
    medicalAssistanceId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      phoneNo: Joi.number(),
      fullAddress: Joi.string(),
      city: Joi.string(),
      description: Joi.string(),
      servicetype: Joi.string(),
      location: Joi.string(),
      startTime: Joi.string(),
      endTime: Joi.string(),
      fullDay: Joi.boolean(),
      days: Joi.array(),
      images: Joi.array(),
    })
    .min(1),
};

const deleteMedicalAssistance = {
  params: Joi.object().keys({
    medicalAssistanceId: Joi.string().custom(objectId),
  }),
};

const verifyMedicalAssistance = {
  params: Joi.object().keys({
    medicalAssistanceId: Joi.string().custom(objectId),
  }),
};

const getMedicalAssistanceByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createMedicalAssistance,
  getMedicalAssistances,
  getMedicalAssistance,
  updateMedicalAssistance,
  deleteMedicalAssistance,
  verifyMedicalAssistance,
  getMedicalAssistanceByUserId,
};
