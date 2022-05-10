const mongoose = require('mongoose');

module.exports.toJSON = require('./toJSON.plugin');
module.exports.paginate = require('./paginate.plugin');
module.exports.deepPopulate = require('mongoose-deep-populate')(mongoose);
