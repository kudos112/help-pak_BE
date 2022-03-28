const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ngoService, emailService } = require('../services');

const createNgo = catchAsync(async (req, res) => {
  const ngo = await ngoService.createNgo(req.body);
  res.status(httpStatus.CREATED).send(ngo);
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

const verifyNgo = catchAsync(async (req, res) => {
  const ngo = await ngoService.verifyNgoById(req.params.ngoId, req.body);
  await emailService.sendVerificationEmail(ngo.email);
  res.send(ngo);
});

const updateNgo = catchAsync(async (req, res) => {
  const ngo = await ngoService.updateNgoById(req.params.ngoId, req.body);
  res.send(ngo);
});

const softDeleteNgo = catchAsync(async (req, res) => {
  await ngoService.softDeleteNgoById(req.params.ngoId);
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
  updateNgo,
  softDeleteNgo,
  hardDeleteNgo,
  verifyNgo,
};
