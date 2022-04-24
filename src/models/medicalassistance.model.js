const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { string } = require('joi');
// const { timestamps } = require('joi');
// const { location } = require('joi');

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
      enum: [
        'Mental health care',
        'Dental care',
        'Laboratory and diagnostic care',
        'Substance abuse treatment',
        'Preventative care',
        'Physical and occupational therapy',
        'Nutritional support',
        'Pharmaceutical care',
        'Transportation',
        'Prenatal care',
      ],
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
      private: true,
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
medicalAssistanceSchema.plugin(toJSON);
medicalAssistanceSchema.plugin(paginate);

/**
 * @typedef MedicalAssistance
 */
const MedicalAssistance = mongoose.model('MedicalAssistance', medicalAssistanceSchema);

module.exports = MedicalAssistance;
