const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { medicalCampService } = require('../services');

const createMedicalCamp = catchAsync(async (req, res) => {
  const medicalCamp = await medicalCampService.createMedicalCamp(req.body);
  res.status(httpStatus.CREATED).send(medicalCamp);
});

const getMedicalCamps = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'type', 'enabled', 'deleted']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await medicalCampService.queryMedicalCamps(filter, options);
  res.send(result);
});

const getProviderMedicalCamps = catchAsync(async (req, res) => {
  const medicalCamp = await medicalCampService.getProviderMedicalCampById(req.params.organizerId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp Service not found');
  }
  res.send(medicalCamp);
});
const getMedicalCamp = catchAsync(async (req, res) => {
  const medicalCamp = await medicalCampService.getMedicalCampById(req.params.campId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp Service not found');
  }
  res.send(medicalCamp);
});

const updateMedicalCamp = catchAsync(async (req, res) => {
  const medicalCamp = await medicalCampService.updateMedicalCampById(req.params.campId, req.body);
  res.send(medicalCamp);
});

const verifyMedicalCamp = catchAsync(async (req, res) => {
  const medicalCamp = await medicalCampService.verifyMedicalCampById(req.params.campId, req.body);
  await emailService.sendAccountVerficationEmail(medicalCamp.email);
  res.send(medicalCamp);
});

const softDeleteMedicalCamp = catchAsync(async (req, res) => {
  const medicalCamp = await medicalCampService.softDeleteMedicalCampById(req.params.campId);
  res.status(httpStatus.NO_CONTENT).send();
});

const hardDeleteMedicalCamp = catchAsync(async (req, res) => {
  await medicalCampService.hardDeleteMedicalCampById(req.params.campId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMedicalCamp,
  getMedicalCamps,
  getProviderMedicalCamps,
  getMedicalCamp,
  updateMedicalCamp,
  verifyMedicalCamp,
  softDeleteMedicalCamp,
  hardDeleteMedicalCamp,
};
