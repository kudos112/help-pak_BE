const mongoose = require('mongoose');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { donationItemService, emailService } = require('../services');

const createDonationItem = catchAsync(async (req, res) => {
  await donationItemService.createDonationItem(req.user, req.body);
  await emailService.sendCreateDonationItem(req.body.email);
  res.status(httpStatus.CREATED).send({
    message: 'Successfull',
    description: "Please wait! You'll get an email when your provided details will be verified by admin",
  });
});

const getDonationItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'category', 'condition', 'city', 'enabled', 'deleted', 'new']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await donationItemService.queryDonationItems(filter, options);
  res.send(result);
});

const getDonationItemByUserId = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await donationItemService.queryDonationItems(
    {
      $and: [{ ownerId: mongoose.Types.ObjectId(req.params.userId) }, { deleted: false }, { enabled: true }],
    },
    options
  );
  res.send(result);
});

const getDonationItemById = catchAsync(async (req, res) => {
  const donationItem = await donationItemService.getDonationItemById(req.params.itemId);
  if (!donationItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  res.send(donationItem);
});

const updateDonationItem = catchAsync(async (req, res) => {
  const donationItem = await donationItemService.updateDonationItemById(req.user.id, req.params.itemId, req.body);
  res.send(donationItem);
});

const verifyDonationItem = catchAsync(async (req, res) => {
  const donationItem = await donationItemService.verifyDonationItemById(req.params.itemId);
  await emailService.sendItemDonationVerficationEmail(donationItem.email, donationItem);
  res.send(donationItem);
});

const softDeleteDonationItem = catchAsync(async (req, res) => {
  const donationItem = await donationItemService.softDeleteDonationItemById(req.params.itemId, req.user);
  if (req.user.role === 'admin') emailService.sendDonationItemDeletedEmail(donationItem);
  res.status(httpStatus.NO_CONTENT).send();
});

const disableDonationItem = catchAsync(async (req, res) => {
  const donationItem = await donationItemService.disableDonationItemById(req.params.itemId);
  await emailService.sendDisabledDonationItemEmail(donationItem);
  res.send(donationItem);
});

const hardDeleteDonationItem = catchAsync(async (req, res) => {
  await donationItemService.hardDeleteDonationItemById(req.params.itemId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDonationItem,
  getDonationItems,
  getDonationItemByUserId,
  getDonationItemById,
  updateDonationItem,
  softDeleteDonationItem,
  hardDeleteDonationItem,
  verifyDonationItem,
  disableDonationItem,
};
