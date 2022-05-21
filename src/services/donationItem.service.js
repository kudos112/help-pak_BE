const httpStatus = require('http-status');
const { DonationItem } = require('../models');
const ApiError = require('../utils/ApiError');
const { statusTypes } = require('../config/model-status');
/**
 * Create a medical assistance services
 * @param {Object} donationItemBody
 * @returns {Promise<DonationItem>}
 */
const createDonationItem = async (user, donationItemBody) => {
  const donationItem = new DonationItem({
    ...donationItemBody,
    ownerId: user.id,
    ownerName: user.name,
    email: donationItemBody?.email || user.email,
    phoneNo: donationItemBody?.phoneNo || user.phoneNo,
  });
  await donationItem.save();
  return donationItem;
};
/**
 * Query for donation items
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDonationItems = async (filter, options) => {
  if (filter.name) {
    filter = {
      ...filter,
      name: new RegExp(`${filter.name}`, 'i'),
    };
  }
  const donationItems = await DonationItem.paginate(filter, options);
  return donationItems;
};

/**
 * Get Donation Item by id
 * @param {ObjectId} id
 * @returns {Promise<DonationItem>}
 */
const getDonationItemById = async (id) => {
  const donationItem = await DonationItem.findById(id);
  if (donationItem.deleted) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found.');
  return donationItem;
};

/**
 * Update donation item Service by id
 * @param {ObjectId} itemId
 * @param {Object} updateBody
 * @returns {Promise<DonationItem>}
 */
const updateDonationItemById = async (userId, itemId, updateBody) => {
  const donationItem = await getDonationItemById(itemId);
  if (!donationItem || (donationItem && donationItem.ownerId.toString() !== userId.toString())) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found.');
  }
  if (updateBody.email && (await DonationItem.isEmailTaken(updateBody.email, itemId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(donationItem, updateBody);
  await donationItem.save();
  return donationItem;
};

/**
 * Get Donation Item by id
 * @param {ObjectId} id
 * @returns {Promise<DonationItem>}
 */
const getDonationItemsByUserId = async (id) => {
  return DonationItem.findById(id);
};

/**
 * softDelete donation item by id
 * Delete donation item by id
 * @param {ObjectId} itemId
 * @returns {Promise<DonationItem>}
 */
const softDeleteDonationItemById = async (itemId) => {
  const donationItem = await getDonationItemById(itemId);
  if (!donationItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  donationItem.deleted = true;
  donationItem.new = false;
  donationItem.status = statusTypes.DELETED;
  donationItem.enabled = false;

  await donationItem.save();
  return donationItem;
};

/**
 * hardDelete donation item Service by id
 * @param {ObjectId} itemId
 * Get Donation Item by id
 * @param {ObjectId} id
 * @returns {Promise<DonationItem>}
 */
const hardDeleteDonationItemById = async (userId, itemId) => {
  const donationItem = await DonationItem.findOne({
    _id: itemId,
    organizer: userId,
  });
  if (!donationItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  await donationItem.remove();
  return donationItem;
};

/**
 * verify medical assistance by id
 * @param {ObjectId} itemId
 * @returns {Promise<DonationItem>}
 */
const verifyDonationItemById = async (itemId) => {
  const donationItem = await getDonationItemById(itemId);
  if (!donationItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  donationItem.enabled = true;
  donationItem.new = false;
  donationItem.status = statusTypes.LIVE;
  await donationItem.save();
  return donationItem;
};

/**
 * disable donation item by id
 * @param {ObjectId} itemId
 * @returns {Promise<DonationItem>}
 */
const disableDonationItemById = async (itemId) => {
  const donationItem = await getDonationItemById(itemId);
  if (!donationItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Donation Item not found');
  }
  donationItem.enabled = false;
  donationItem.new = false;
  donationItem.status = statusTypes.DISABLED;
  await donationItem.save();
  return donationItem;
};

module.exports = {
  createDonationItem,
  queryDonationItems,
  getDonationItemById,
  updateDonationItemById,
  softDeleteDonationItemById,
  hardDeleteDonationItemById,
  verifyDonationItemById,
  getDonationItemsByUserId,
  disableDonationItemById,
};
