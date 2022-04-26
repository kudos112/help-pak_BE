const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { string, number } = require('joi');

const medicalCampSchema = mongoose.Schema(
    {
      campname: {
        type: String,
        required: true,
        trim: true,
      },
      camptype: {
          type: String,
          required: true,
          enum: ['eye','blood'],
          trim: true,
      },
      description: {
          type: String,
          required: true,
          unique: false,
          trim: false,
      },
      location: {
          type: String,
          required: true,
          unique: false,
          trim: false,
      },
      providername: {
        type: String,
        required: true,
        trim: true,
      },
      provideremail: {
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
      providerid: {
          type: Number,
          required: true,
          unique: false,
          trim: true,
      },
      role: {
        type: String,
        enum: roles,
        default: 'provider',
        private: true,
      },
      contact: {
          type: Number,
          required: true,
          unique: false,
          trim: true,
      },
      starttime: {
          type: String,
          required: true,
          unique: false,
      },
      endtime: {
        type: String,
        required: true,
        unique: false,
      },
      campdays: {
        type: Array,
        required: true,
      },
      images: {
        type: Array,
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
medicalCampSchema.plugin(toJSON);
medicalCampSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The MedicalCamp's email
 * @param {ObjectId} [excludeCampId] - The id of the Medical Camp to be excluded
 * @returns {Promise<boolean>}
 */
 medicalCampSchema.statics.isEmailTaken = async function (email, excludeCampId) {
  //MedicalCamp ID need to be created.....
  const mediCamp = await this.findOne({ email, _id: { $ne: excludeCampId } });
  return !!mediCamp;
};

/**
 * Check if password matches the medicalcamp's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
medicalCampSchema.methods.isPasswordMatch = async function (password) {
  const mediCamp = this;
  return bcrypt.compare(password, mediCamp.password);
};

medicalCampSchema.pre('save', async function (next) {
  const mediCamp = this;
  if (mediCamp.isModified('password')) {
    mediCamp.password = await bcrypt.hash(mediCamp.password, 8);
  }
  next();
});

/**
 * @typedef MedicalCamp
 */
const MedicalCamp = mongoose.model('MedicalCamp', medicalCampSchema);

module.exports = MedicalCamp;