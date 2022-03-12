const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const ngoSchema = mongoose.Schema(
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
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    images: {
      type: Array,
      required: true,
    },
    regNo: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'ngo',
      private: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      private: true,
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
ngoSchema.plugin(toJSON);
ngoSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The NGO's email
 * @param {ObjectId} [excludeNgoId] - The id of the NGO to be excluded
 * @returns {Promise<boolean>}
 */
ngoSchema.statics.isEmailTaken = async function (email, excludeNgoId) {
  //NGO ID need to be created.....
  const ngo = await this.findOne({ email, _id: { $ne: excludeNgoId } });
  return !!ngo;
};

/**
 * Check if password matches the ngo's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
ngoSchema.methods.isPasswordMatch = async function (password) {
  const ngo = this;
  return bcrypt.compare(password, ngo.password);
};

ngoSchema.pre('save', async function (next) {
  const ngo = this;
  if (ngo.isModified('password')) {
    ngo.password = await bcrypt.hash(ngo.password, 8);
  }
  next();
});

/**
 * @typedef Ngo
 */
const Ngo = mongoose.model('Ngo', ngoSchema);

module.exports = Ngo;
