const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const Schema = mongoose.Schema;

//Create Schema
const ProjectsCompletedSchema = new Schema(
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

ProjectsCompletedSchema.plugin(toJSON);
ProjectsCompletedSchema.plugin(paginate);

module.exports = ProjectsCompleted = mongoose.model('ProjectsCompleted', ProjectsCompletedSchema);
