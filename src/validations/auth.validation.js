const Joi = require('joi');
const { password } = require('./custom.validation');

const userRegister = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    userType: Joi.string().required(),
    images: Joi.array().required(),
    phoneNo: Joi.string().required(),
  }),
};

const ngoRegister = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    userType: Joi.string().required(),
    images: Joi.array().required(),
    regNo: Joi.string().required(),
    phoneNo: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    userType: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  userRegister,
  ngoRegister,
  login,
  adminLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
