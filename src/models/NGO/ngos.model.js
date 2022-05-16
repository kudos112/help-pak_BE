const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../plugins');
const { roles } = require('../config/roles');
const { statusTypes } = require('../config/model-status');

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
    description: {
      type: String,
      required: true,
    },
    vision: {
      type: String,
      required: true,
    },
    ouMission: {
      type: String,
      required: true,
    },
    quickLinks: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuickLinks',
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    followUs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FollowUs',
      required: true,
    },
    personPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PersonPosts',
      required: true,
    },
    whoWeAre: {
      type: String,
      required: true,
    },
    whatWeDo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectsCompleted',
      required: true,
    },
    ourPartners: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OurPartners',
      required: true,
    },
    background: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'ngo',
      private: true,
    },
    status: {
      type: string,
      default: statusTypes.NEW,
    },
    new: {
      type: boolean,
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
