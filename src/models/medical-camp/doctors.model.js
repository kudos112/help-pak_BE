const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const Schema = mongoose.Schema;

//Create Schema
const DoctorsSchema = new Schema(
  {
    data: {
      type: Array,
      default: [],
    },
    campId: {
      type: Schema.Types.ObjectId,
      ref: 'MedicalCamp',
      required: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

DoctorsSchema.plugin(toJSON);
DoctorsSchema.plugin(paginate);

module.exports = Doctors = mongoose.model('Doctors', DoctorsSchema);
