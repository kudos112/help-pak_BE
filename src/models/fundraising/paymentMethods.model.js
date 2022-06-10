const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const Schema = mongoose.Schema;

//Create Schema
const PaymentMethodsSchema = new Schema(
  {
    data: {
      type: Array,
      default: [],
    },
    fundraisingId: {
      type: Schema.Types.ObjectId,
      ref: 'Fundraising',
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

PaymentMethodsSchema.plugin(toJSON);
PaymentMethodsSchema.plugin(paginate);

module.exports = PaymentMethods = mongoose.model('PaymentMethods', PaymentMethodsSchema);
