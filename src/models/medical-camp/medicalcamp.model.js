const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('../plugins');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

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
      //camp official email
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
    // scheduledDays: {
    //   type: Array,
    //   required: true,
    // },
    images: {
      type: Array,
      required: true,
    },
    noOfDoctors: {
      type: Number,
      required: true,
    },
    doctors: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctors',
      required: true,
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
