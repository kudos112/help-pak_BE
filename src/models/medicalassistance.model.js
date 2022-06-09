const mongoose = require('mongoose');
const validator = require('validator');
const { statusTypes } = require('../config/model-status');
const { toJSON, paginate } = require('./plugins');

const medicalAssistanceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
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
      type: Number,
      required: true,
      unique: false,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },

    serviceType: {
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
    location: {
      type: String, //Location,
    },
    startTime: {
      type: String, //timestamps,
    },
    endTime: {
      type: String, //timestamps,
    },
    fullDay: {
      type: Boolean,
      required: true,
    },
    workingDays: {
      type: Array,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    providerName: {
      type: String,
      required: true,
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
    disabled: {
      type: Boolean,
      default: false,
    },
    new: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: statusTypes.NEW,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
medicalAssistanceSchema.plugin(toJSON);
medicalAssistanceSchema.plugin(paginate);

/**
 * @typedef MedicalAssistance
 */
const MedicalAssistance = mongoose.model('MedicalAssistance', medicalAssistanceSchema);

module.exports = MedicalAssistance;
