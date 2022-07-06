const mongoose = require('mongoose');
const validator = require('validator');
<<<<<<< HEAD:src/models/NGO/ngos.model.js
//const bcrypt = require('bcryptjs');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const { toJSON, paginate } = require('../plugins');
const { roles } = require('../../config/roles');
const { statusTypes } = require('../../config/model-status');
=======
const { toJSON, paginate } = require('../plugins');
const { statusTypes } = require('../../config/model-status');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
>>>>>>> bd3e8211399f2274bdd80872364756882ab165d6:src/models/ngos/ngos.model.js

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
    phoneNo: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
<<<<<<< HEAD:src/models/NGO/ngos.model.js
    ngoAuthenticationCertificationImage: {
      type: Array,
      required: true,
    },
    description: {
=======
    fullAddress: {
>>>>>>> bd3e8211399f2274bdd80872364756882ab165d6:src/models/ngos/ngos.model.js
      type: String,
      required: true,
      trim: true,
    },
    regNo: {
      type: String,
      required: true,
      trim: true,
    },
    vision: {
      type: String,
<<<<<<< HEAD:src/models/NGO/ngos.model.js
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
=======
      default: '',
      required: true,
>>>>>>> bd3e8211399f2274bdd80872364756882ab165d6:src/models/ngos/ngos.model.js
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
<<<<<<< HEAD:src/models/NGO/ngos.model.js
      ref: 'User',
=======
      default: '',
>>>>>>> bd3e8211399f2274bdd80872364756882ab165d6:src/models/ngos/ngos.model.js
    },
    images: {
      type: Array,
      required: true,
    },
    founder: {
      type: {
        name: {
          type: String,
          required: true,
        },
        picture: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          default: null,
        },
      },
      required: true,
    },
    paymentMethods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethodsNgo',
        required: true,
      },
    ],
    creater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
<<<<<<< HEAD:src/models/NGO/ngos.model.js
=======
      enum: Object.values(statusTypes),
>>>>>>> bd3e8211399f2274bdd80872364756882ab165d6:src/models/ngos/ngos.model.js
      default: statusTypes.NEW,
    },
    new: {
      type: Boolean,
      default: true,
    },
    published: {
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
 * Check if name is taken
 * @param {string} name - The NGO's name
 * @param {ObjectId} [excludeNgoId] - The id of the NGO to be excluded
 * @returns {Promise<boolean>}
 */
ngosSchema.statics.isNameTaken = async function (name, excludeNgoId) {
  //NGO ID need to be created.....
  const ngo = await this.findOne({ name, _id: { $ne: excludeNgoId }, deleted: false });
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
  const ngo = await this.findOne({ regNo, _id: { $ne: excludeNgoId }, deleted: false });
  return !!ngo;
};

/**
 * @typedef Ngo
 */
const Ngo = mongoose.model('Ngo', ngosSchema);

module.exports = Ngo;
