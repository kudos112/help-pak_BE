const httpStatus = require('http-status');
const { MedicalCamp } = require('../models');
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
 * Get Medical Camp by id
 * @param {ObjectId} id
 * @returns {Promise<MedicalCamp>}
 */
const getMedicalCampById = async (id) => {
  return MedicalCamp.findById(id);
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
/** Not need to get medical services with password and email both. Task done with the help of medicalAssistanceId.
 * 
const getMedicalCampWithEmailAndPassword = async (email, password) => {
  const medicalCamp = await MedicalCamp.findOne({ email });
  if (medicalCamp) if (await medicalCamp.isPasswordMatch(password)) return medicalCamp;
  return null;
};
*/

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
 * Delete medical Camp Service by id
 * @param {ObjectId} medicalCampId
 * @returns {Promise<MedicalCamp>}
 */
const deleteMedicalCampById = async (medicalCampId) => {
  const medicalCamp = await getMedicalCampById(medicalCampId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp not found');
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
 // getMedicalAssistanceWithEmailAndPassword,
  updateMedicalCampById,
  deleteMedicalCampById,
};
