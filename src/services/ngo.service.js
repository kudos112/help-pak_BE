const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { User, Ngo } = require('../models');
const ApiError = require('../utils/ApiError');
const PaymentMethods = require('../models/ngos/paymentMethods.model');
const { statusTypes } = require('../config/model-status');
const { getNgos } = require('../validations/ngo.validation');

/**
 * Create a ngo
 * @param {Object} ngoBody
 * @returns {Promise<Ngo>}
 */
const createNgo = async (ngoBody, user) => {
  if (user.userType !== 'NGO' || user.regNo == null) throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized!');
  if (await Ngo.isNameTaken(ngoBody.name))
    throw new ApiError(httpStatus.BAD_REQUEST, 'A NGO already registered with this name');
  if (await Ngo.isRegNoTaken(ngoBody.regNo))
    throw new ApiError(httpStatus.BAD_REQUEST, 'A NGO already registered with this Registration Number');

  const ngoId = new mongoose.Types.ObjectId();

  let paymentMethods = ngoBody.paymentMethods;
  let pmIds = [];

  for (let i = 0; i < paymentMethods.length; i++) {
    const paymentMethod = await PaymentMethods.create({
      ...paymentMethods[i],
      ngoId,
    });
    if (!paymentMethod) return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error occured! Try again');
    pmIds.push(paymentMethod.id);
  }

  let newNgo = {
    _id: ngoId,
    name: ngoBody.name,
    city: ngoBody.city,
    fullAddress: ngoBody.fullAddress,
    email: ngoBody.email,
    phoneNo: ngoBody.phoneNo,
    regNo: user.regNo,
    vision: ngoBody?.vision || '',
    background: ngoBody.background || '',
    images: ngoBody.images,
    founder: ngoBody.founder,
    creater: user.id,
    paymentMethods: pmIds,
  };

  const ngo = await Ngo.create(newNgo);

  if (!ngo) throw new ApiError(httpStatus.BAD_REQUEST, 'NGO not created');

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
  if (filter.name) {
    filter = {
      ...filter,
      name: new RegExp(`${filter.name}`, 'i'),
    };
  }

  filter.deleted = false;
  const ngos = await Ngo.paginate(filter, options);
  return ngos;
};

/**
 * Get ngo by id
 * @param {ObjectId} id
 * @returns {Promise<Ngo>}
 */
const getNgoById = async (id) => {
  const ngo = await Ngo.findById(id).populate('paymentMethods creater');
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
  // if (updateBody?.paymentMethods?.length > 0) {
  //   for (let i = 0; i < paymentMethods.length; i++) {
  //     const paymentMethod = await PaymentMethods.create({
  //       ...paymentMethods[i],
  //       ngoId,
  //     });
  //     if (!paymentMethod) return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error occured! Try again');
  //     pmIds.push(paymentMethod.id);
  //   }
  // }

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
  ngo.published = true;
  ngo.new = false;
  ngo.status = statusTypes.LIVE;
  await ngo.save();
  return ngo;
};

/**
 * verify ngo by id
 * @param {ObjectId} ngoId
 * @returns {Promise<User>}
 */
const disableNgoById = async (ngoId) => {
  const ngo = await getNgoById(ngoId);
  if (!ngo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  ngo.published = false;
  ngo.new = false;
  ngo.status = statusTypes.DISABLED;
  await ngo.save();
  return ngo;
};

const getUsersNgos = async (creater) => {
  const ngos = await Ngo.find({ creater, deleted: false, published: true }).deepPopulate(`paymentMethods`).exec();
  if (!ngos) {
    throw new ApiError(httpStatus.NOT_FOUND, 'NGO not found');
  }
  return ngos;
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
  getUsersNgos,
  verifyNgoById,
  disableNgoById,
};
