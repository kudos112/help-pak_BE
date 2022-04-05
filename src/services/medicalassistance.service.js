const httpStatus = require('http-status');
const { MedicalAssistance } = require('../models');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { sendEmail } = require('./email.service');

/**
 * Create a medical assistance services
 * @param {ObjectId} userId
 * @param {Object} medicalAssistanceBody
 * @returns {Promise<MedicalAssistance>}
 */
const createMedicalAssistance = async (userId, medicalAssistanceBody) => {
    const generateassistance = new MedicalAssistance({
      ...medicalAssistanceBody,
      provider: userId
     })
     generateassistance.save();
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
  const medicalAssistances = await MedicalAssistance.paginate(filter, options);
  return medicalAssistances;
};

// /**
//  * Query for medical assistance services
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResult>}
//  */

/**
 * Get Medical Assistance by id
 * @param {ObjectId} userId
 * @returns {Promise<MedicalAssistance>}
 */
const getUserMedicalAssitancesbyID = async (userId) => {             //This service is not working
  //await MedicalAssistance.paginate(filter, options);
  // return medicalAssistances;
  const user = await User.findOne({provider : userId})
  if (User?.deleted === true) return null;
  console.log('yes');
  await user.populate('medicalAssistanceDetail').execPopulate()
  console.log(user.medicalAssistanceDetail)
  send(user.medicalAssistanceDetail)
};

/**
 * Get Medical Assistance by id
 * @param {ObjectId} id
 * @returns {Promise<MedicalAssistance>}
 */
const getMedicalAssistanceById = async (id) => {
  const medicalAssistance = await MedicalAssistance.findOne({ _id : id});
  if (medicalAssistance?.deleted === true) return null;
  return medicalAssistance;
};

/**
 * Get Medical Assistance by Provider id
 * @param {ObjectId} id
 * @returns {Promise<MedicalAssistance>}
 */
 const getMedicalAssistanceByProviderId = async (id) => {

  const medicalAssistanceProvider = await MedicalAssistance.findById(id);
  if (medicalAssistanceProvider?.deleted === true) return null;
  return medicalAssistanceProvider;
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
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<MedicalAssistance>}
 */
const updateMedicalAssistanceById = async (userId, medicalAssistanceId, updateBody) => {
      const updateassistance = await MedicalAssistance.findOne({
          _id: medicalAssistanceId,
          provider: userId
        })
        if (!updateassistance) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance not found');
        }
        if (updateBody.email && (await MedicalAssistance.isEmailTaken(updateBody.email, medicalAssistanceId))) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        Object.assign(updateassistance, updateBody);
        await updateassistance.save()
};
  
/**
 * verify medical assistance by id
 * @param {ObjectId} medicalAssistanceId
 * @returns {Promise<MedicalAssistance>}
 */
 const verifyMedicalAssistanceById = async (medicalAssistanceId) => {
  const medicalassistance = await getMedicalAssistanceById(medicalAssistanceId);
  if (!medicalassistance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance not found');
  }
  medicalassistance.enabled = true;
  await medicalassistance.save();
  return medicalassistance;
};

/**
 * softDelete medical Assistance Service by id
 * @param {ObjectId} medicalAssistanceId
 * @returns {Promise<MedicalAssistance>}
 */
const softDeleteMedicalAssistanceById = async (userId, medicalAssistanceId) => {
  const medicalAssistance = await MedicalAssistance.findOne({
    _id: medicalAssistanceId,
    provider: userId
  })
  // const medicalAssistance = await getMedicalAssistanceById(medicalAssistanceId);
   if (!medicalAssistance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance not found');
  }
  medicalAssistance.deleted = true;
  await medicalAssistance.save();
};
/**
 * hardDelete medical Assistance Service by id
 * @param {ObjectId} medicalAssistanceId
 * @returns {Promise<MedicalAssistance>}
 */
const hardDeleteMedicalAssistanceById = async (userId, medicalAssistanceId) => {
  const medicalAssistance = await MedicalAssistance.findOne({
    _id: medicalAssistanceId,
    provider: userId
  })
  //const medicalAssistance = await MedicalAssistance.findById(medicalAssistanceId);
  if (!medicalAssistance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance not found');
  }
  await medicalAssistance.remove();
  return medicalAssistance;
};

// /**
//  * Delete medical Assistance Service by id
//  * @param {ObjectId} medicalAssistanceId
//  * @returns {Promise<MedicalAssistance>}
//  */
// const deleteMedicalAssistanceById = async (medicalAssistanceId) => {
//   const medicalAssistance = await getMedicalAssistanceById(medicalAssistanceId);
//   if (!medicalAssistance) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance not found');
//   }
//   await medicalAssistance.remove();
//   return medicalAssistance;
// };

module.exports = {
  createMedicalAssistance,
  queryMedicalAssitances,
  getUserMedicalAssitancesbyID,
  getMedicalAssistanceById,
  getMedicalAssistanceByEmail,
 // getMedicalAssistanceWithEmailAndPassword,
  updateMedicalAssistanceById,
  // deleteMedicalAssistanceById,
  softDeleteMedicalAssistanceById,
  hardDeleteMedicalAssistanceById,
};