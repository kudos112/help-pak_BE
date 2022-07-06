const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('../plugins');
const { statusTypes } = require('../../config/model-status');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const ngosSchema = mongoose.Schema(
  {
    name: {
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
    regNo: {
      type: String,
      required: true,
      trim: true,
    },
    vision: {
      type: String,
      default: '',
      required: true,
    },
    background: {
      type: String,
      required: true,
      default: '',
    },
    images: {
      type: Array,
      required: true,
    },
    founder: {
      type: {
        name: {
          type: String,
          required: true,
        },
        picture: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          default: null,
        },
      },
      required: true,
    },
    paymentMethods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethodsNgo',
        required: true,
      },
    ],
    creater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(statusTypes),
      default: statusTypes.NEW,
    },
    new: {
      type: Boolean,
      default: true,
    },
    published: {
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
ngosSchema.plugin(toJSON);
ngosSchema.plugin(paginate);
ngosSchema.plugin(deepPopulate);

/**
 * Check if name is taken
 * @param {string} name - The NGO's name
 * @param {ObjectId} [excludeNgoId] - The id of the NGO to be excluded
 * @returns {Promise<boolean>}
 */
ngosSchema.statics.isNameTaken = async function (name, excludeNgoId) {
  //NGO ID need to be created.....
  const ngo = await this.findOne({ name, _id: { $ne: excludeNgoId }, deleted: false });
  return !!ngo;
};

/**
 * Check if regNo is taken
 * @param {string} regNo - The NGO's regNo
 * @param {ObjectId} [excludeNgoId] - The id of the NGO to be excluded
 * @returns {Promise<boolean>}
 */
ngosSchema.statics.isRegNoTaken = async function (regNo, excludeNgoId) {
  //NGO ID need to be created.....
  const ngo = await this.findOne({ regNo, _id: { $ne: excludeNgoId }, deleted: false });
  return !!ngo;
};

/**
 * @typedef Ngo
 */
const Ngo = mongoose.model('Ngo', ngosSchema);

module.exports = Ngo;
