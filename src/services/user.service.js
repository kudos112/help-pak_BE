const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (userBody.userType === 'NGO') {
    if (userBody.regNo) userBody = { ...userBody, role: 'user' };
    else throw new ApiError(httpStatus.BAD_REQUEST, 'Ngo Registration number is requried to signup');
  }
  const user = await User.create(userBody);
  return user;
};

/**
 * Query for user
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (user?.deleted === true) return null;
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (user?.deleted === true) return null;
  return user;
};

const getUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email });
  if (user?.deleted) return null;
  if (user) if (await user.isPasswordMatch(password)) return user;
  return null;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * softDelete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const softDeleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.deleted = true;
  await user.save();
  return user;
};

/**
 * verify user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const verifyUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.enabled = true;
  await user.save();
  return user;
};

/**
 * hardDelete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const hardDeleteUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  verifyUserById,
  getUserWithEmailAndPassword,
  updateUserById,
  softDeleteUserById,
  hardDeleteUserById,
};
