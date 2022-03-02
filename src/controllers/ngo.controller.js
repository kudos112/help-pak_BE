const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ngoService } = require('../services');

const createNgo = catchAsync(async (req, res) => {
  const ngo = await ngoService.createNgo(req.body);
  res.status(httpStatus.CREATED).send(ngo);
});

const getNgos = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
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

const updateNgo = catchAsync(async (req, res) => {
  const ngo = await ngoService.updateNgoById(req.params.ngoId, req.body);
  res.send(ngo);
});

const deleteNgo = catchAsync(async (req, res) => {
  await ngoService.deleteNgoById(req.params.ngoId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNgo,
  getNgos,
  getNgo,
  updateNgo,
  deleteNgo,
};
