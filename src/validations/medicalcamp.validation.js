const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createMedicalCamp = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    campType: Joi.string().required(),
    email: Joi.string().required().email(),
    city: Joi.string().required(),
    fullAddress: Joi.string().required(),
    // organizerName: Joi.string().required(),
    // organizerEmail: Joi.string().required().email(),
    // organizerId: Joi.number().integer().required(),
    phoneNo: Joi.number().integer().required(),
    description: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().optional().allow('').allow(null),
    doctors: Joi.array().min(0).required(),
    // scheduledDays: Joi.array().required(),
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
    enabled: Joi.boolean(),
    deleted: Joi.boolean(),
    new: Joi.boolean(),
    city: Joi.string().allow(""),
    campType: Joi.string().allow(""),
    name: Joi.string().allow(""),
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

const disableMedicalCamp = {
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
      email: Joi.string().optional().email(),
      city: Joi.string().optional(),
      fullAddress: Joi.string().optional(),
      organizerName: Joi.string().optional(),
      organizerEmail: Joi.string().optional().email(),
      phoneNo: Joi.number().integer().optional(),
      description: Joi.string().optional(),
      startTime: Joi.string().optional(),
      endTime: Joi.string().optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
      doctors: Joi.array().min(1).optional(),
      images: Joi.array().optional(),
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
  disableMedicalCamp,
  deleteMedicalCamp,
};
