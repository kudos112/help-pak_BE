const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, emailService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'enabled', 'deleted']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const users = await userService.queryUsers(filter, options);
  res.send(users);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const verifyUser = catchAsync(async (req, res) => {
  const user = await userService.verifyUserById(req.params.userId);
  await emailService.sendAccountVerficationEmail(user.email);
  res.send(user);
});

const softDeleteUser = catchAsync(async (req, res) => {
  const user = await userService.softDeleteUserById(req.params.userId);
  if (req.user.role === 'admin') emailService.sendUnverifiedAccountEmail(user.email);
  res.status(httpStatus.NO_CONTENT).send();
});
const hardDeleteUser = catchAsync(async (req, res) => {
  await userService.hardDeleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  verifyUser,
  softDeleteUser,
  hardDeleteUser,
};
