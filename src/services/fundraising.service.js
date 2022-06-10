const httpStatus = require('http-status');
const mongoose = require('mongoose');
const PaymentMethods = require('../models/fundraising/paymentMethods.model');
const Fundraising = require('../models/fundraising/fundraising.model');
const ApiError = require('../utils/ApiError');
const { sendEmail } = require('./email.service');

/**
 * Create a fundraising services
 * @param {Object} fundraisingBody
 * @returns {Promise<Fundraising>}
 */
const createFundraising = async (user, fundraisingBody) => {
  if (await Fundraising.isNameTaken(fundraisingBody.name)) throw new ApiError(httpStatus.BAD_REQUEST, 'name already taken');

  const fundraisingId = new mongoose.Types.ObjectId();
  const paymentMethods = await PaymentMethods.create({
    data: fundraisingBody.paymentMethods,
    fundraisingId,
  });

  let newFundraisingBody = { ...fundraisingBody };

  delete newFundraisingBody['paymentMethods'];

  const fundraising = await Fundraising.create({
    _id: fundraisingId,
    paymentMethods: paymentMethods._id,
    noOfPaymentMethods: fundraisingBody.paymentMethods.length,
    organizerId: user.id,
    organizerName: user.name,
    organizerEmail: user.email,
    ...newFundraisingBody,
  });
  return fundraising;
};

/**
 * Query for fundraising services
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFundraisings = async (filter, options) => {
  if (filter.name) {
    filter = {
      ...filter,
      name: new RegExp(`${filter.name}`, 'i'),
    };
  }
  const fundraisings = await Fundraising.paginate(filter, options);
  return fundraisings;
};

/**
 * Get fundraising by id
 * @param {ObjectId} id
 * @returns {Promise<Fundraising>}
 */
const getFundraisingById = async (id) => {
  const fundraising = await Fundraising.findById(id).deepPopulate(`paymentMethods`).exec();
  if (!fundraising || fundraising?.deleted === true) return null;
  return fundraising;
};

/**
 * Get Provider Fundraising by id
 * @param {ObjectId} id
 * @returns {Promise<Fundraising>}
 */
const getProviderFundraisingById = async (organizerId) => {
  const fundraising = await Fundraising.findById(organizerId).deepPopulate(`paymentMethods`).exec();
  if (!fundraising) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Fundraising not found');
  }
  return fundraising;
};

/**
 * Update fundraising Service by id
 * @param {ObjectId} fundraisingId
 * @param {Object} updateBody
 * @returns {Promise<Fundraising>}
 */
const updateFundraisingById = async (fundraisingId, updateBody, userId) => {
  const fundraising = await getFundraisingById(fundraisingId);

  if (
    !fundraising ||
    !fundraising.enabled ||
    fundraising.deleted ||
    (fundraising && fundraising.organizerId.toString() != userId.toString())
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No fundraising found against this id');
  }

  if (updateBody.name && (await Fundraising.isNameTaken(updateBody.name, fundraisingId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'name already taken');
  }

  let newFundraisingBody = { ...updateBody };
  const paymentMethods = await PaymentMethods.findOne({
    fundraisingId,
  }).exec();
  if (updateBody.paymentMethods) {
    paymentMethods.data = updateBody.paymentMethods;
    await paymentMethods.save();

    newFundraisingBody = { ...newFundraisingBody, noOfPaymentMethods: paymentMethods.data.length };
  }

  delete newFundraisingBody['paymentMethods'];

  const newFundraising = {
    paymentMethods: paymentMethods._id,
    ...newFundraisingBody,
  };

  Object.assign(fundraising, newFundraising);
  await fundraising.save();
  const updated = await getFundraisingById(fundraisingId);
  return updated;
};

/**
 * verify fundraising by id
 * @param {ObjectId} fundraisingId
 * @returns {Promise<Fundraising>}
 */
const verifyFundraisingById = async (fundraisingId) => {
  const fundraising = await getFundraisingById(fundraisingId);
  if (!fundraising) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Fundraising not found');
  }
  fundraising.enabled = true;
  fundraising.new = false;
  fundraising.status = 'Live';
  await fundraising.save();
  return fundraising;
};

/**
 * disable fundraising by id
 * @param {ObjectId} fundraisingId
 * @returns {Promise<Fundraising>}
 */
const disableFundraisingById = async (fundraisingId) => {
  const fundraising = await getFundraisingById(fundraisingId);
  if (!fundraising) {
    throw new ApiError(httpStatus.NOT_FOUND, 'fundraising not found');
  }
  fundraising.enabled = false;
  fundraising.new = false;
  fundraising.status = 'Disabled';
  await fundraising.save();
  return fundraising;
};

/**
 * softDelete fundraising by id
 * @param {ObjectId} fundraisingId
 * @returns {Promise<Fundraising>}
 */
const softDeleteFundraisingById = async (fundraisingId) => {
  const fundraising = await getFundraisingById(fundraisingId);
  if (!fundraising) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Fundraising not found');
  }
  fundraising.deleted = true;
  fundraising.new = false;
  fundraising.enabled = false;
  fundraising.status = 'Deleted';
  await fundraising.save();
};

/**
 * hardDelete fundraising  by id
 * @param {ObjectId} fundraisingId
 * @returns {Promise<Fundraising>}
 */
const hardDeleteFundraisingById = async (fundraisingId) => {
  const fundraising = await Fundraising.findById(fundraisingId);
  if (!fundraising) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Fundraising not found');
  }
  await fundraising.remove();
  return fundraising;
};

module.exports = {
  createFundraising,
  queryFundraisings,
  getFundraisingById,
  getProviderFundraisingById,
  updateFundraisingById,
  verifyFundraisingById,
  softDeleteFundraisingById,
  hardDeleteFundraisingById,
  disableFundraisingById,
};
