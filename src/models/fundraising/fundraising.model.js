const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const validator = require('validator');
const { statusTypes } = require('../../config/model-status');
const { toJSON, paginate } = require('../plugins');

const fundraisingSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    fullAddress: {
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
      // trim: true,
    },
    images: {
      type: Array,
      default: [],
    },
    noOfPaymentMethods: {
      type: Number,
      default: 0,
    },
    paymentMethods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethods',
        required: true,
      },
    ],
    fundraiserName: {
      type: String,
      trim: true,
    },
    fundraiserEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    fundraiserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      default: statusTypes.NEW,
    },
    new: {
      type: Boolean,
      default: true,
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
fundraisingSchema.plugin(toJSON);
fundraisingSchema.plugin(paginate);
fundraisingSchema.plugin(deepPopulate);

/**
 * Check if name is taken
 * @param {string} name - The fundraisers's name
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
fundraisingSchema.statics.isNameTaken = async function (name, excludeUserId) {
  const fundraising = await this.findOne({ name, _id: { $ne: excludeUserId } });
  return !!fundraising;
};

/**
 * @typedef Fundraising
 */
const Fundraising = mongoose.model('Fundraising', fundraisingSchema);

module.exports = Fundraising;
