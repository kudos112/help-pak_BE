const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createMedicalCamp = {
  body: Joi.object().keys({
    campname: Joi.string().required(),
    camptype: Joi.string().required(),
    location: Joi.string().required(),
    providername: Joi.string().required(),
    provideremail: Joi.string().required().email(),
    providerid: Joi.number().integer().required(),
    role: Joi.string().required().valid('provider', 'admin'),
    contact: Joi.number().integer().required(),
    description: Joi.string().required(),
    starttime: Joi.string().required(),
    endtime: Joi.string().required(),
    campdays: Joi.array().required(),
    images: Joi.array().required(),
  }),
};

const getMedicalCamps = {
  query: Joi.object().keys({
    providername: Joi.string(),
    providerid: Joi.number().integer(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProviderMedicalCamps = {
    params: Joi.object().keys({
        providerid: Joi.number(),
      }),
  };

const getMedicalCamp = {
  params: Joi.object().keys({
    medicalCampId: Joi.string().custom(objectId),
  }),
};

const verifyMedicalCamp = {
  params: Joi.object().keys({
    medicalCampId: Joi.string().custom(objectId),
  }),
};

const updateMedicalCamp = {
  params: Joi.object().keys({
    medicalCampId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      provideremail: Joi.string().email(),
      password: Joi.string().custom(password),
      providername: Joi.string(),
      campname: Joi.string(),
    })
    .min(1),
};

const deleteMedicalCamp = {
  params: Joi.object().keys({
    medicalCampId: Joi.string().custom(objectId),
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
