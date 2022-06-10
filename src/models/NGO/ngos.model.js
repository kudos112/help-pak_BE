const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('../plugins');
const { statusTypes } = require('../config/model-status');

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
    regNo: {
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
      default: '',
    },
    ourMission: {
      type: String,
      default: '',
    },
    whoWeAre: {
      type: String,
      default: '',
    },
    background: {
      type: String,
      default: '',
    },
    images: {
      type: Array,
      required: true,
    },
    personPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PersonPosts',
      // required: true,
      default: null,
    },
    whatWeDid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectsCompleted',
      // required: true,
      default: null,
    },
    ourPartners: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OurPartners',
      // required: true,
      defualt: null,
    },
    quickLinks: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuickLinks',
      // required: true,
      default: null,
    },
    followUs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FollowUs',
      // required: true,
      default: null,
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
 * Check if name is taken
 * @param {string} name - The NGO's name
 * @param {ObjectId} [excludeNgoId] - The id of the NGO to be excluded
 * @returns {Promise<boolean>}
 */
ngosSchema.statics.isNameTaken = async function (name, excludeNgoId) {
  //NGO ID need to be created.....
  const ngo = await this.findOne({ name, _id: { $ne: excludeNgoId } });
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
  const ngo = await this.findOne({ regNo, _id: { $ne: excludeNgoId } });
  return !!ngo;
};

/**
 * @typedef Ngo
 */
const Ngo = mongoose.model('Ngo', ngosSchema);

module.exports = Ngo;
