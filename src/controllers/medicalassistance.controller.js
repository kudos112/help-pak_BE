const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { medicalAssistanceService, emailService } = require('../services');

const createMedicalAssistance = catchAsync(async (req, res) => {
  await medicalAssistanceService.createMedicalAssistance(req.user, req.body);
  await emailService.sendCreateMedicalService(req.body.email);
  res.status(httpStatus.CREATED).send({
    message: 'Successfull',
    description: "Please wait! You'll get an email when your provided details will be verified by admin",
  });
});

const getMedicalAssistances = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'servicetype', 'city', 'enabled', 'deleted']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await medicalAssistanceService.queryMedicalAssitances(filter, options);
  res.send(result);
});

const getUserMedicalAssistances = catchAsync(async (req, res) => {
  //not working
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
  const medicalAssistance = await medicalAssistanceService.updateMedicalAssistanceById(
    req.user.id,
    req.params.medicalAssistanceId,
    req.body
  );
  res.send(medicalAssistance);
});

const verifyMedicalAssistance = catchAsync(async (req, res) => {
  const medicalAssistance = await medicalAssistanceService.verifyMedicalAssistanceById(req.params.medicalAssistanceId);
  await emailService.sendMedicalAssistanceVerficationEmail(medicalAssistance.email, medicalAssistance);
  res.send(medicalAssistance);
});

const softdeleteMedicalAssistance = catchAsync(async (req, res) => {
  const medicalAssistance = await medicalAssistanceService.softDeleteMedicalAssistanceById(req.params.medicalAssistanceId);
  if (req.user.role === 'admin') emailService.sendUnverifiedAccountEmail(medicalAssistance.email);
  res.status(httpStatus.NO_CONTENT).send();
});
const hardDeleteMedicalAssistance = catchAsync(async (req, res) => {
  await medicalAssistanceService.hardDeleteMedicalAssistanceById(req.params.medicalAssistanceId);
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
  verifyMedicalAssistance,
};
