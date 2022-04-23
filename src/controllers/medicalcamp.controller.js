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
  const filter = pick(req.query, ['campname', 'camptype']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await medicalCampService.queryMedicalCamps(filter, options);
  res.send(result);
});

const getProviderMedicalCamps = catchAsync(async (req, res) => {
    
    //console.log("yes");
    const medicalCamp = await medicalCampService.getProviderMedicalCampById(req.params.providerid);
    if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp Service not found');
    }
    //console.log("yes");
    res.send(medicalCamp);

    // const filter = pick(req.query, ['providername', 'providerid']);
    // const options = pick(req.query, ['sortBy', 'limit', 'page']);
    // const result = await medicalCampService.queryMedicalCamps(filter, options);
    // res.send(result);
  });
const getMedicalCamp = catchAsync(async (req, res) => {
  const medicalCamp = await medicalCampService.getMedicalCampById(req.params.medicalCampId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp Service not found');
  }
  res.send(medicalCamp);
});

const updateMedicalCamp = catchAsync(async (req, res) => {
  const medicalCamp = await medicalCampService.updateMedicalCampById(req.params.medicalCampId, req.body);
  res.send(medicalCamp);
});

const deleteMedicalCamp = catchAsync(async (req, res) => {
  await medicalCampService.deleteMedicalCampById(req.params.medicalCampId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMedicalCamp,
  getMedicalCamps,
  getProviderMedicalCamps,
  getMedicalCamp,
  updateMedicalCamp,
  deleteMedicalCamp,
};
