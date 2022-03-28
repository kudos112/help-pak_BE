const httpStatus = require('http-status');
const { User, Ngo } = require('../models');
const ApiError = require('../utils/ApiError');
const { sendEmail } = require('./email.service');

/**
 * Create a ngo
 * @param {Object} ngoBody
 * @returns {Promise<Ngo>}
 */
const createNgo = async (ngoBody) => {
  if ((await User.isEmailTaken(ngoBody.email)) || (await Ngo.isEmailTaken(ngoBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const ngo = await Ngo.create(ngoBody);

  return ngo;
};

/**
 * Query for ngo
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNgos = async (filter, options) => {
  const ngos = await Ngo.paginate(filter, options);
  return ngos;
};

/**
 * Get ngo by id
 * @param {ObjectId} id
 * @returns {Promise<Ngo>}
 */
const getNgoById = async (id) => {
  const ngo = await Ngo.findById(id);
  if (ngo?.deleted === true) return null;
  return ngo;
};

/**
 * Get ngo by email
 * @param {string} email
 * @returns {Promise<Ngo>}
 */
const getNgoByEmail = async (email) => {
  return Ngo.findOne({ email });
};

const getNgoWithEmailAndPassword = async (email, password) => {
  const ngo = await Ngo.findOne({ email });
  if (ngo) if (await ngo.isPasswordMatch(password)) return ngo;
  return null;
};

/**
 * Update ngo by id
 * @param {ObjectId} ngoId
 * @param {Object} updateBody
 * @returns {Promise<Ngo>}
 */
const updateNgoById = async (ngoId, updateBody) => {
  const ngo = await getNgoById(ngoId);
  if (!ngo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  if (updateBody.email && (await Ngo.isEmailTaken(updateBody.email, ngoId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(ngo, updateBody);
  await ngo.save();
  return ngo;
};

/**
 * softDelete ngo by id
 * @param {ObjectId} ngoId
 * @returns {Promise<Ngo>}
 */
const softDeleteNgoById = async (ngoId) => {
  const ngo = await getNgoById(ngoId);
  if (!ngo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  ngo.deleted = true;
  await ngo.save();
};
/**
 * hardDelete ngo by id
 * @param {ObjectId} ngoId
 * @returns {Promise<Ngo>}
 */
const hardDeleteNgoById = async (ngoId) => {
  const ngo = await Ngo.findById(ngoId);
  if (!ngo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  await ngo.remove();
  return ngo;
};

/**
 * verify ngo by id
 * @param {ObjectId} ngoId
 * @returns {Promise<User>}
 */
const verifyNgoById = async (ngoId) => {
  const ngo = await getNgoById(ngoId);
  if (!ngo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  ngo.enabled = true;
  await ngo.save();
  return ngo;
};

module.exports = {
  createNgo,
  queryNgos,
  getNgoById,
  getNgoByEmail,
  getNgoWithEmailAndPassword,
  updateNgoById,
  softDeleteNgoById,
  hardDeleteNgoById,
  verifyNgoById,
};
