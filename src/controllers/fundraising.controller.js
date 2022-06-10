const httpStatus = require('http-status');
const mongoose = require('mongoose');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { fundraisingService, emailService } = require('../services');

const createFundraising = catchAsync(async (req, res) => {
  await fundraisingService.createFundraising(req.user, req.body);
  await emailService.sendCreateFundraising(req.body.email);
  res.status(httpStatus.CREATED).send({
    message: 'Successfull',
    description: "Please wait! You'll get an email when your provided details will be verified by admin",
  });
});

const getFundraisings = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'requestForFundraising', 'enabled', 'deleted', 'new', 'city']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await fundraisingService.queryFundraisings(filter, options);
  res.send(result);
});

const getFundraisingByOrganizerId = catchAsync(async (req, res) => {
  // const _filter = pick(req.query, ['name', 'serviceType', 'city', 'enabled', 'deleted']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await fundraisingService.queryFundraisings(
    {
      $and: [{ organizerId: mongoose.Types.ObjectId(req.params.organizerId) }, { deleted: false }, { enabled: true }],
    },
    options
  );
  res.send(result);
});

const getFundraising = catchAsync(async (req, res) => {
  const fundraising = await fundraisingService.getFundraisingById(req.params.fundraisingId);
  if (!fundraising) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Fundraising is not found');
  }
  res.send(fundraising);
});

const updateFundraising = catchAsync(async (req, res) => {
  const fundraising = await fundraisingService.updateFundraisingById(req.params.fundraisingId, req.body, req.user._id);
  res.send(fundraising);
});

const verifyFundraising = catchAsync(async (req, res) => {
  const fundraising = await fundraisingService.verifyFundraisingById(req.params.fundraisingId);
  await emailService.sendAccountVerficationEmail(fundraising.email);
  res.send(fundraising);
});

const disableFundraising = catchAsync(async (req, res) => {
  const fundraising = await fundraisingService.disableFundraisingById(req.params.fundraisingId);
  await emailService.sendAccountVerficationEmail(fundraising.email);
  res.send(fundraising);
});

const softDeleteFundraising = catchAsync(async (req, res) => {
  await fundraisingService.softDeleteFundraisingById(req.params.fundraisingId);
  res.status(httpStatus.NO_CONTENT).send();
});

const hardDeleteFundraising = catchAsync(async (req, res) => {
  await fundraisingService.hardDeleteFundraisingById(req.params.fundraisingId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFundraising,
  getFundraisings,
  getFundraisingByOrganizerId,
  getFundraising,
  updateFundraising,
  verifyFundraising,
  softDeleteFundraising,
  hardDeleteFundraising,
  disableFundraising,
};
