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
      phoneNo: {      //phoneNo
          type: Number,
          required: true,
          unique: false,
          trim: true,
      },
      streetAddress:{
        type: String,
        required: true,
        unique: false,
      },
      city: {
        type: String,
        required: true,
        unique: false,
      },
      provider: {      
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      description: {
          type: String,
          required: true,
      },
      servicetype: { 
          type: String,
          required: true,
          enum: ['physical','online'],
          trim: true,
      },
      location: {    
          type: String,//Location,
          required: true,
      },
      startTime: {      
          type: String,//timestamps,
      },
      endTime: {      
        type: String,//timestamps,
      },
      fullDay: {      
          type: Boolean,
          required: true,
          },
      days: {      
        type: Array,
        required: true,
        trim: true,
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
medicalAssistanceSchema.plugin(toJSON);
medicalAssistanceSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The MedicalAssistance's email
 * @param {ObjectId} [excludeAssistanceId] - The id of the Medical Assistance to be excluded
 * @returns {Promise<boolean>}
 */
 medicalAssistanceSchema.statics.isEmailTaken = async function (email, excludeAssistanceId) {
  //MedicalAssistance ID need to be created.....
  const mediAssist = await this.findOne({ email, _id: { $ne: excludeAssistanceId } });
  return !!mediAssist;
};

/**
 * Check if password matches the medicalassistance's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
medicalAssistanceSchema.methods.isPasswordMatch = async function (password) {
  const mediAssist = this;
  return bcrypt.compare(password, mediAssist.password);
};

medicalAssistanceSchema.pre('save', async function (next) {
  const mediAssist = this;
  if (mediAssist.isModified('password')) {
    mediAssist.password = await bcrypt.hash(mediAssist.password, 8);
  }
  next();
});

/**
 * @typedef MedicalAssistance
 */
const MedicalAssistance = mongoose.model('MedicalAssistance', medicalAssistanceSchema);

module.exports = MedicalAssistance;