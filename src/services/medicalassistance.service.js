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
  if (medicalAssistance)
    sendEmail(
      medicalAssistanceBody.email,
      'Medical Assistance Service successfully created',
      'Medical Assistance Service Successfully Created'
    );
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
  if (filter.name) {
    filter = {
      ...filter,
      name: new RegExp(`${filter.name}`, 'i'),
    };
  }
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

/**
 * Get Medical Assistance by id
 * @param {ObjectId} id
 * @returns {Promise<MedicalAssistance>}
 */
const getMedicalAssistancesByUserId = async (id) => {
  return MedicalAssistance.findById(id);
};

module.exports = {
  createMedicalAssistance,
  queryMedicalAssitances,
  getMedicalAssistanceById,
  updateMedicalAssistanceById,
  deleteMedicalAssistanceById,
  getMedicalAssistancesByUserId,
};
