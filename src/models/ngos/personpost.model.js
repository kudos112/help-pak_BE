const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const Schema = mongoose.Schema;

//Create Schema
const PersonsPostSchema = new Schema(
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

PersonsPostSchema.plugin(toJSON);
PersonsPostSchema.plugin(paginate);

module.exports = PersonsPost = mongoose.model('PersonsPost', PersonsPostSchema);
