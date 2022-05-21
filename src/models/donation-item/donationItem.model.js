const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('../plugins');
const { statusTypes } = require('../../config/model-status');

const donationItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    // brand: {
    //   type: String,
    //   // required: true,
    //   default: '',
    //   trim: true,
    // },
    // used: {
    //   type: String,
    //   ,
    //   trim: true,
    // },
    condition: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    phoneNo: {
      type: String,
      required: true,
      trim: true,
    },
    fullAddress: {
      type: String,
      required: true,
      unique: false,
    },
    city: {
      type: String,
      required: true,
      unique: false,
    },
    images: {
      type: Array,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    ownerName: {
      type: String,
      required: true,
    },
    new: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: statusTypes.NEW,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
donationItemSchema.plugin(toJSON);
donationItemSchema.plugin(paginate);

/**
 * @typedef ItemDonation
 */
const ItemDonation = mongoose.model('ItemDonation', donationItemSchema);

module.exports = ItemDonation;
