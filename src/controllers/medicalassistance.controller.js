const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { medicalAssistanceService } = require('../services');

const createMedicalAssistance = catchAsync(async (req, res) => {
  const medicalAssistance = await medicalAssistanceService.createMedicalAssistance(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(medicalAssistance);
  });

const getMedicalAssistances = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'description', 'servicetype', 'location']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await medicalAssistanceService.queryMedicalAssitances(filter, options);
  res.send(result);
});

const getUserMedicalAssistances = catchAsync(async (req, res) => {                        //not working
  const medicalAssistance = await medicalAssistanceService.getUserMedicalAssitancesbyID(req.user.id);
  res.send(medicalAssistance);
});

const getMedicalAssistance = catchAsync(async (req, res) => {
  const medicalAssistance = await medicalAssistanceService.getMedicalAssistanceById(req.params.medicalAssistanceId);
  if (!medicalAssistance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Assistance Service not found');
  }
  res.send(medicalAssistance);
});

const updateMedicalAssistance = catchAsync(async (req, res) => {
  const medicalAssistance = await medicalAssistanceService.updateMedicalAssistanceById(req.user.id, req.params.medicalAssistanceId, req.body);
  res.send(medicalAssistance);
});

// const deleteMedicalAssistance = catchAsync(async (req, res) => {
//   await medicalAssistanceService.deleteMedicalAssistanceById(req.params.medicalAssistanceId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

const softdeleteMedicalAssistance = catchAsync(async (req, res) => {
  const medicalAssistance = await medicalAssistanceService.softDeleteMedicalAssistanceById(req.user.id, req.params.medicalAssistanceId);
  if (req.user.role === 'admin') emailService.sendUnverifiedAccountEmail(user.email);
  res.status(httpStatus.NO_CONTENT).send();
});
const hardDeleteMedicalAssistance = catchAsync(async (req, res) => {
  await medicalAssistanceService.hardDeleteMedicalAssistanceById(req.user.id, req.params.medicalAssistanceId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMedicalAssistance,
  getMedicalAssistances,
  getUserMedicalAssistances,
  getMedicalAssistance,
  updateMedicalAssistance,
  // deleteMedicalAssistance,
  softdeleteMedicalAssistance,
  hardDeleteMedicalAssistance,
};
