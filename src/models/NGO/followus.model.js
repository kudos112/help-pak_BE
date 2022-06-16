const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const Schema = mongoose.Schema;

//Create Schema
const FollowUsSchema = new Schema(
  {
    data: {
      type: Array,
      defaults: [],
    },
    ngoId: {
      type: Schema.Types.ObjectId,
      ref: 'Ngo',
      required: true,
    },
    visible: {
      type: Boolean,
      defaults: true,
    },
  },
  {
    timestamps: true,
  }
);

FollowUsSchema.plugin(toJSON);
FollowUsSchema.plugin(paginate);

module.exports = FollowUs = mongoose.model('FollowUs', FollowUsSchema);
