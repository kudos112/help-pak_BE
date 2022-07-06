const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const Schema = mongoose.Schema;

//Create Schema
const QuickLinksSchema = new Schema(
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

QuickLinksSchema.plugin(toJSON);
QuickLinksSchema.plugin(paginate);

module.exports = QuickLinks = mongoose.model('QuickLinks', QuickLinksSchema);
