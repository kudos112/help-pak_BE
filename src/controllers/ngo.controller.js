const httpStatus = require('http-status');
const mongoose = require('mongoose');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ngoService, emailService } = require('../services');

const createNgo = catchAsync(async (req, res) => {
  await ngoService.createNgo(req.user, req.body);
  await emailService.sendCreateNgo(req.body.email);
  res.status(httpStatus.CREATED).send({
    message: 'Successfull',
    description: "Please wait! You'll get an email when your provided details will be verified by admin",
  });
});

const getNgos = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'enabled', 'deleted']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await ngoService.queryNgos(filter, options);
  res.send(result);
});

const getNgo = catchAsync(async (req, res) => {
  const ngo = await ngoService.getNgoById(req.params.ngoId);
  if (!ngo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  res.send(ngo);
});

const getNgoByOwnerId = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await ngoService.queryNgos(
    {
      $and: [{ ownerId: mongoose.Types.ObjectId(req.params.ownerId) }, { deleted: false }, { enabled: true }],
    },
    options
  );
  res.send(result);
});

const verifyNgo = catchAsync(async (req, res) => {
  const ngo = await ngoService.verifyNgoById(req.params.ngoId, req.body);
  await emailService.sendVerificationEmail(ngo.email);
  res.send(ngo);
});

const updateNgo = catchAsync(async (req, res) => {
  const ngo = await ngoService.updateNgoById(req.params.ngoId, req.body, req.user._id);
  res.send(ngo);
});

const disableNgo = catchAsync(async (req, res) => {
  const ngo = await ngoService.disableNgoById(req.params.ngoId);
  await emailService.sendNgoDisableEmail(ngo);
  res.send(ngo);
});

const softDeleteNgo = catchAsync(async (req, res) => {
  await ngoService.softDeleteNgoById(req.params.ngoId);
  await emailService.sendNgoDeletedEmail(ngo.email);
  res.status(httpStatus.NO_CONTENT).send();
});
const hardDeleteNgo = catchAsync(async (req, res) => {
  await ngoService.hardDeleteNgoById(req.params.ngoId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNgo,
  getNgos,
  getNgo,
  getNgoByOwnerId,
  updateNgo,
  softDeleteNgo,
  disableNgo,
  hardDeleteNgo,
  verifyNgo,
};
