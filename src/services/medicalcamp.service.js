const httpStatus = require('http-status');
const MedicalCamp = require('../models/medicalcamp.model');
const ApiError = require('../utils/ApiError');
const { sendEmail } = require('./email.service');

/**
 * Create a medical camp services
 * @param {Object} medicalCampBody
 * @returns {Promise<MedicalCamp>}
 */
const createMedicalCamp = async (medicalCampBody) => {

  const medicalCamp = await MedicalCamp.create(medicalCampBody);
  if (medicalCamp) sendEmail(medicalCampBody.email, 'Medical Camp Service successfully created', 'Medical Camp Service Successfully Created');
  return medicalCamp;
};

/**
 * Query for medical camp services
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMedicalCamps = async (filter, options) => {
  const medicalCamps = await MedicalCamp.paginate(filter, options);
  return medicalCamps;
};

/**
 * Get medical camp by id
 * @param {ObjectId} id
 * @returns {Promise<MedicalCamp>}
 */
 const getMedicalCampById = async (id) => {
  const medicalCamp = await MedicalCamp.findById(id);
  if (medicalCamp?.deleted === true) return null;
  return medicalCamp;
};


/**
 * Get Provider Medical Camp by id
 * @param {ObjectId} id
 * @returns {Promise<MedicalCamp>}
 */
 const getProviderMedicalCampById = async (providerid) => {
     
    //console.log("yes");
    return MedicalCamp.findById(providerid);
  };

/**
 * Get Medical Camp by email
 * @param {string} email
 * @returns {Promise<MedicalCamp>}
 */
const getMedicalCampByEmail = async (email) => {
  return MedicalCamp.findOne({ provideremail });
};

/**
 * Update medical Camp Service by id
 * @param {ObjectId} medicalCampId
 * @param {Object} updateBody
 * @returns {Promise<MedicalCamp>}
 */
const updateMedicalCampById = async (medicalCampId, updateBody) => {
  const medicalCamp = await getMedicalCampById(medicalCampId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp not found. No service available by provider');
  }
  if (updateBody.email && (await MedicalCamp.isEmailTaken(updateBody.email, medicalCampId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(medicalCamp, updateBody);
  await medicalCamp.save();
  return medicalCamp;
};

/**
 * verify medical camp by id
 * @param {ObjectId} medicalCampId
 * @returns {Promise<MedicalCamp>}
 */
 const verifyMedicalCampById = async (medicalCampId) => {
  const medicalCamp = await getMedicalCampById(medicalCampId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp not found');
  }
  medicalCamp.enabled = true;
  await medicalCamp.save();
  return medicalCamp;
};

/**
 * softDelete medicalCamp by id
 * @param {ObjectId} medicalCampId
 * @returns {Promise<MedicalCamp>}
 */
 const softDeleteMedicalCampById = async (medicalCampId) => {
  const medicalCamp = await getMedicalCampById(medicalCampId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp not found');
  }
  medicalCamp.deleted = true;
  await medicalCamp.save();
};

/**
 * hardDelete medical camp by id
 * @param {ObjectId} medicalCampId
 * @returns {Promise<MedicalCamp>}
 */
 const hardDeleteMedicalCampById = async (medicalCampId) => {
  const medicalCamp = await MedicalCamp.findById(medicalCampId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medicals Camp not found');
  }
  await medicalCamp.remove();
  return medicalCamp;
};

module.exports = {
  createMedicalCamp,
  queryMedicalCamps,
  getMedicalCampById,
  getProviderMedicalCampById,
  getMedicalCampByEmail,
  updateMedicalCampById,
  verifyMedicalCampById,
  softDeleteMedicalCampById,
  hardDeleteMedicalCampById,
};
