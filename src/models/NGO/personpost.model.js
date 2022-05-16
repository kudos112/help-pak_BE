const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const Schema = mongoose.Schema;

//Create Schema
const PersonPostSchema = new Schema(
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

PersonPostSchema.plugin(toJSON);
PersonPostSchema.plugin(paginate);

module.exports = PersonPost = mongoose.model('PersonPost', PersonPostSchema);