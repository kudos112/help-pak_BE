const httpStatus = require('http-status');
const { MedicalAssistance } = require('../models');
const ApiError = require('../utils/ApiError');
const { sendEmail } = require('./email.service');

/**
 * Create a medical assistance services
 * @param {Object} medicalAssistanceBody
 * @returns {Promise<MedicalAssistance>}
 */
const createMedicalAssistance = async (medicalAssistanceBody) => {

  const medicalAssistance = await MedicalAssistance.create(medicalAssistanceBody);
  if (medicalAssistance) sendEmail(medicalAssistanceBody.email, 'Medical Assistance Service successfully created', 'Medical Assistance Service Successfully Created');
  return medicalAssistance;
};

/**
 * Query for medical assistance services
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMedicalAssitances = async (filter, options) => {
  const medicalAssistances = await MedicalAssistance.paginate(filter, options);
  return medicalAssistances;
};

/**
 * Get Medical Assistance by id
 * @param {ObjectId} id
 * @returns {Promise<MedicalAssistance>}
 */
const getMedicalAssistanceById = async (id) => {
  return MedicalAssistance.findById(id);
};

/**
 * Get Medical Assistance by email
 * @param {string} email
 * @returns {Promise<MedicalAssistance>}
 */
const getMedicalAssistanceByEmail = async (email) => {
  return MedicalAssistance.findOne({ email });
};
/** Not need to get medical services with password and email both. Task done with the help of medicalAssistanceId.
 * 
const getMedicalAssistanceWithEmailAndPassword = async (email, password) => {
  const medicalAssistance = await MedicalAssistance.findOne({ email });
  if (medicalAssistance) if (await medicalAssistance.isPasswordMatch(password)) return medicalAssistance;
  return null;
};
*/

/**
 * Update medical Assistance Service by id
 * @param {ObjectId} medicalAssistanceId
 * @param {Object} updateBody
 * @returns {Promise<MedicalAssistance>}
 */
const updateMedicalAssistanceById = async (medicalAssistanceId, updateBody) => {
  const medicalAssistance = await getMedicalAssistanceById(medicalAssistanceId);
  if (!medicalAssistance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance not found. No service available by provider');
  }
  if (updateBody.email && (await MedicalAssistance.isEmailTaken(updateBody.email, medicalAssistanceId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(medicalAssistance, updateBody);
  await medicalAssistance.save();
  return medicalAssistance;
};

/**
 * Delete medical Assistance Service by id
 * @param {ObjectId} medicalAssistanceId
 * @returns {Promise<MedicalAssistance>}
 */
const deleteMedicalAssistanceById = async (medicalAssistanceId) => {
  const medicalAssistance = await getMedicalAssistanceById(medicalAssistanceId);
  if (!medicalAssistance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance not found');
  }
  await medicalAssistance.remove();
  return medicalAssistance;
};

module.exports = {
  createMedicalAssistance,
  queryMedicalAssitances,
  getMedicalAssistanceById,
  getMedicalAssistanceByEmail,
 // getMedicalAssistanceWithEmailAndPassword,
  updateMedicalAssistanceById,
  deleteMedicalAssistanceById,
};
