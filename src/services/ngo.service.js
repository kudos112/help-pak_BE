const httpStatus = require('http-status');
const { User, Ngo } = require('../models');
const ApiError = require('../utils/ApiError');
const { sendEmail } = require('./email.service');

/**
 * Create a ngo
 * @param {Object} userBody
 * @returns {Promise<Ngo>}
 */
const createNgo = async (userBody) => {
  if ((await User.isEmailTaken(userBody.email)) || (await Ngo.isEmailTaken(userBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const ngo = await Ngo.create(userBody);

  if (ngo) sendEmail(userBody.email, 'Ngo successfully created', 'Ngo Successfully Created');
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
  return Ngo.findById(id);
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

module.exports = {
  createNgo,
  queryNgos,
  getNgoById,
  getNgoByEmail,
  getNgoWithEmailAndPassword,
  updateNgoById,
  softDeleteNgoById,
  hardDeleteNgoById,
};
