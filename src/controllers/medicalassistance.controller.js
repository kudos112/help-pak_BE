const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { medicalAssistanceService } = require('../services');

const createMedicalAssistance = catchAsync(async (req, res) => {
  const medicalAssistance = await medicalAssistanceService.createMedicalAssistance(req.body);
  res.status(httpStatus.CREATED).send(medicalAssistance);
});

const getMedicalAssistances = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'servicetype']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await medicalAssistanceService.queryMedicalAssitances(filter, options);
  res.send(result);
});

const getMedicalAssistance = catchAsync(async (req, res) => {
  const medicalAssistance = await medicalAssistanceService.getMedicalAssistanceById(req.params.medicalAssistanceId);
  if (!medicalAssistance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance Service not found');
  }
  res.send(medicalAssistance);
});

const updateMedicalAssistance = catchAsync(async (req, res) => {
  const medicalAssistance = await medicalAssistanceService.updateMedicalAssistanceById(req.params.medicalAssistanceId, req.body);
  res.send(medicalAssistance);
});

const deleteMedicalAssistance = catchAsync(async (req, res) => {
  await medicalAssistanceService.deleteMedicalAssistanceById(req.params.medicalAssistanceId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMedicalAssistance,
  getMedicalAssistances,
  getMedicalAssistance,
  updateMedicalAssistance,
  deleteMedicalAssistance,
};
