const httpStatus = require('http-status');
const { MedicalAssistance } = require('../models');
const ApiError = require('../utils/ApiError');
const { sendEmail } = require('./email.service');

/**
 * Create a medical assistance services
 * @param {Object} medicalAssistanceBody
 * @returns {Promise<MedicalAssistance>}
 */
const createMedicalAssistance = async (user, medicalAssistanceBody) => {
  const generateassistance = new MedicalAssistance({
    ...medicalAssistanceBody,
    provider: user.id,
    providerName: user.name,
  });
  await generateassistance.save();
  return generateassistance;
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
const updateMedicalAssistanceById = async (userId, medicalAssistanceId, updateBody) => {
  const medicalAssistance = await getMedicalAssistanceById(medicalAssistanceId);
  if (
    !medicalAssistance ||
    !medicalAssistance.enabled ||
    medicalAssistance.deleted ||
    (medicalAssistance && medicalAssistance.provider.toString() != userId.toString())
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance not found.');
  }
  if (updateBody.email && (await MedicalAssistance.isEmailTaken(updateBody.email, medicalAssistanceId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(medicalAssistance, updateBody);
  await medicalAssistance.save();
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

/**
 * softDelete medical Assistance Service by id
 * Delete medical Assistance Service by id
 * @param {ObjectId} medicalAssistanceId
 * @returns {Promise<MedicalAssistance>}
 */
const softDeleteMedicalAssistanceById = async (medicalAssistanceId) => {
  const medicalAssistance = await getMedicalAssistanceById(medicalAssistanceId);
  if (!medicalAssistance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance not found');
  }
  medicalAssistance.deleted = true;
  await medicalAssistance.save();
  return medicalAssistance;
};

/**
 * hardDelete medical Assistance Service by id
 * @param {ObjectId} medicalAssistanceId
 * Get Medical Assistance by id
 * @param {ObjectId} id
 * @returns {Promise<MedicalAssistance>}
 */
const hardDeleteMedicalAssistanceById = async (userId, medicalAssistanceId) => {
  const medicalAssistance = await MedicalAssistance.findOne({
    _id: medicalAssistanceId,
    provider: userId,
  });
  if (!medicalAssistance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance not found');
  }
  await medicalAssistance.remove();
  return medicalAssistance;
};

/**
 * verify medical assistance by id
 * @param {ObjectId} medicalAssistanceId
 * @returns {Promise<MedicalAssistance>}
 */
const verifyMedicalAssistanceById = async (medicalAssistanceId) => {
  const medicalAssistance = await getMedicalAssistanceById(medicalAssistanceId);
  if (!medicalAssistance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance not found');
  }
  medicalAssistance.enabled = true;
  await medicalAssistance.save();
  return medicalAssistance;
};

module.exports = {
  createMedicalAssistance,
  queryMedicalAssitances,
  getMedicalAssistanceById,
  updateMedicalAssistanceById,
  softDeleteMedicalAssistanceById,
  hardDeleteMedicalAssistanceById,
  verifyMedicalAssistanceById,
  getMedicalAssistancesByUserId,
};
