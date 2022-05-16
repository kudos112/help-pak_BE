const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const Schema = mongoose.Schema;

//Create Schema
const OurPartnersSchema = new Schema(
    {
        data: {
            type: Array,
            defaults: [],
        },
        ngoRegNo: {
            type: Schema.Types.ObjectId,
            ref: 'Ngo',
            required: true,
          },
        visible: {
            type: boolean,
            defaults: true,
        },
    },
    {
        timestamps: true,
    }
);

OurPartnersSchema.plugin(toJSON);
OurPartnersSchema.plugin(paginate);

module.exports = OurPartners = mongoose.model('OurPartners', OurPartnersSchema);