const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const validator = require('validator');
const { toJSON, paginate } = require('../plugins');

const medicalCampSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    campType: {
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
      type: Number,
      required: true,
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    images: {
      type: Array,
      required: true,
    },
    noOfDoctors: {
      type: Number,
      default: 0,
      // required: true,
    },
    doctors: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctors',
      // required: true,
      default: null,
    },
    organizerName: {
      type: String,
      trim: true,
    },
    organizerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      default: 'New',
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
medicalCampSchema.plugin(toJSON);
medicalCampSchema.plugin(paginate);
medicalCampSchema.plugin(deepPopulate);

/**
 * Check if name is taken
 * @param {string} name - The medical camp's name
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
medicalCampSchema.statics.isNameTaken = async function (name, excludeUserId) {
  const camp = await this.findOne({ name, _id: { $ne: excludeUserId } });
  return !!camp;
};

/**
 * @typedef MedicalCamp
 */
const MedicalCamp = mongoose.model('MedicalCamp', medicalCampSchema);

module.exports = MedicalCamp;
