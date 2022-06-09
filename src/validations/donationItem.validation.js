const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDonationItem = {
  body: Joi.object().keys({
    category: Joi.string().required(),
    name: Joi.string().required(),
    // brand: Joi.string().required(),
    // used: Joi.string().required(),
    condition: Joi.number().required(),
    color: Joi.string().optional().allow(''),
    email: Joi.string().optional().email(),
    phoneNo: Joi.string().required(),
    fullAddress: Joi.string().required(),
    city: Joi.string().required(),
    description: Joi.string().required(),
    images: Joi.array().min(1).required(),
  }),
};

const getDonationItems = {
  query: Joi.object().keys({
    name: Joi.string().allow('').allow(null),
    category: Joi.string().allow('').allow(null),
    condition: Joi.string().allow('').allow(null),
    city: Joi.string().allow('').allow(null),
    sortBy: Joi.string().allow('').allow(null),
    limit: Joi.number().integer().allow('').allow(null),
    page: Joi.number().integer().allow('').allow(null),
    new: Joi.boolean(),
    enabled: Joi.boolean(),
    deleted: Joi.boolean(),
  }),
};

const getDonationItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

const updateDonationItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      category: Joi.string().optional(),
      // brand: Joi.string().optional(),
      // used: Joi.string().optional(),
      condition: Joi.number().optional(),
      color: Joi.string().optional().allow(''),
      name: Joi.string().required(),
      email: Joi.string().optional().email(),
      phoneNo: Joi.string().optional(),
      fullAddress: Joi.string().optional(),
      city: Joi.string().optional(),
      description: Joi.string().optional(),
      images: Joi.array().min(1).optional(),
    })
    .min(1),
};

const deleteDonationItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

const verifyDonationItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

const disableDonationItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

const getDonationItemByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createDonationItem,
  getDonationItems,
  getDonationItem,
  updateDonationItem,
  deleteDonationItem,
  verifyDonationItem,
  getDonationItemByUserId,
  disableDonationItem,
};
