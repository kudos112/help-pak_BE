const httpStatus = require('http-status');
const mongoose = require('mongoose');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { medicalCampService } = require('../services');

const createMedicalCamp = catchAsync(async (req, res) => {
  const medicalCamp = await medicalCampService.createMedicalCamp(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(medicalCamp);
});

const getMedicalCamps = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'type', 'enabled', 'deleted']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await medicalCampService.queryMedicalCamps(filter, options);
  res.send(result);
});

const getMedicalCampByOrganizerId = catchAsync(async (req, res) => {
  // const _filter = pick(req.query, ['name', 'serviceType', 'city', 'enabled', 'deleted']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await medicalCampService.queryMedicalCamps(
    {
      $and: [{ organizerId: mongoose.Types.ObjectId(req.params.organizerId) }, { deleted: false }, { enabled: true }],
    },
    options
  );
  res.send(result);
});

const getMedicalCamp = catchAsync(async (req, res) => {
  const medicalCamp = await medicalCampService.getMedicalCampById(req.params.campId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp Service not found');
  }
  res.send(medicalCamp);
});

const updateMedicalCamp = catchAsync(async (req, res) => {
  const medicalCamp = await medicalCampService.updateMedicalCampById(req.params.campId, req.body, req.user._id);
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
  getMedicalCampByOrganizerId,
  getMedicalCamp,
  updateMedicalCamp,
  verifyMedicalCamp,
  softDeleteMedicalCamp,
  hardDeleteMedicalCamp,
};
