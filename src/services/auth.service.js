const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const ngoService = require('./ngo.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginWithEmailAndPassword = async (userType, email, password) => {
  if (userType === 'INDIVIDUAL') {
    const user = await userService.getUserWithEmailAndPassword(email, password);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    if (user.enabled === false) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please wait! You'll get an email when you'll be verified");
    }
    return user;
  } else if (userType === 'NGO') {
    const ngo = await ngoService.getNgoWithEmailAndPassword(email, password);
    if (!ngo) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    if (ngo.enabled === false) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please wait! You'll get an email when you'll be verified");
    }
    return ngo;
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');

  // else
  // cons user = await ngoService.getUserByEmail( email );
};

const adminLoginWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserWithEmailAndPassword(email, password);
  if (!user || user.role !== 'admin') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    const ngo = await ngoService.getNgoById(resetPasswordTokenDoc.user);
    if (!user && !ngo) {
      throw new Error();
    }
    if (user) {
      await userService.updateUserById(user?.id, { password: newPassword });
      await Token.deleteMany({ user: user?.id, type: tokenTypes.RESET_PASSWORD });
    } else {
      await ngoService.updateNgoById(ngo?.id, { password: newPassword });
      await Token.deleteMany({ user: ngo?.id, type: tokenTypes.RESET_PASSWORD });
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

/**
 * Get Logged In User Details email
 * @returns {Promise(User)}
 */
const getLoggedInUserDetails = async (userId) => {
  try {
    const user = await userService.getUserById(userId);
    const ngo = await ngoService.getNgoById(userId);
    return user || ngo;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User Not found');
  }
};

module.exports = {
  loginWithEmailAndPassword,
  adminLoginWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  getLoggedInUserDetails,
};
