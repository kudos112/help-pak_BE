const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createMedicalAssistance = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    CNIC: Joi.number().integer().required(),
    phoneNo: Joi.number().integer().required(),
    description: Joi.string().required(),
    servicetype: Joi.string().required(),
    medicalservicelocation: Joi.string().required(),
    medicalservicetime: Joi.string().required(),
    medicalservicedate: Joi.string().required(),
    image: Joi.array().required(),
  }),
};

const getMedicalAssistances = {
  query: Joi.object().keys({
    name: Joi.string(),
    CNIC: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMedicalAssistance = {
  params: Joi.object().keys({
    medicalAssistanceId: Joi.string().custom(objectId),
  }),
};

const updateMedicalAssistance = {
  params: Joi.object().keys({
    medicalAssistanceId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteMedicalAssistance = {
  params: Joi.object().keys({
    medicalAssistanceId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createMedicalAssistance,
  getMedicalAssistances,
  getMedicalAssistance,
  updateMedicalAssistance,
  deleteMedicalAssistance,
};
