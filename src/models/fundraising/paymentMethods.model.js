const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const Schema = mongoose.Schema;

//Create Schema
const PaymentMethodsSchema = new Schema(
  {
    bankName: {
      type: String,
      required: true,
    },
    accountNo: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    fundraisingId: {
      type: mongoose.Schema.Types.ObjectId,
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
