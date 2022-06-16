const mongoose = require('mongoose');
const validator = require('validator');
//const bcrypt = require('bcryptjs');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const { toJSON, paginate } = require('../plugins');
const { roles } = require('../../config/roles');
const { statusTypes } = require('../../config/model-status');

const ngosSchema = mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
      enum: ['NGO'],
      trim: true,
    },
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
    ngoRegNo: {
      type: String,
      required: true,
      trim: true,
    },
    ngoAuthenticationCertificationImage: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    vision: {
      type: String,
      required: true,
    },
    ourMission: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    quickLinks: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuickLinks',
      default: null,
    },
    followUs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FollowUs',
      default: null,
    },
    personsPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PersonsPosts',
      default: null,
    },
    whoWeAre: {
      type: String,
      required: true,
    },
    whatWeDo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectsCompleted',
      default: null,
    },
    ourPartners: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OurPartners',
      default: null,
    },
    ownerName: {
      type: String,
      trim: true,
    },
    ownerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    role: {
      type: String,
      enum: roles,
      default: 'ngo',
      private: true,
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
ngosSchema.plugin(toJSON);
ngosSchema.plugin(paginate);
ngosSchema.plugin(deepPopulate);

/**
 * Check if email is taken
 * @param {string} email - The NGO's email
 * @param {ObjectId} [excludeNgoId] - The id of the NGO to be excluded
 * @returns {Promise<boolean>}
 */
ngosSchema.statics.isEmailTaken = async function (email, excludeNgoId) {
  //NGO ID need to be created.....
  const ngo = await this.findOne({ email, _id: { $ne: excludeNgoId } });
  return !!ngo;
};

/**
 * @typedef Ngo
 */
const Ngo = mongoose.model('Ngo', ngosSchema);

module.exports = Ngo;
