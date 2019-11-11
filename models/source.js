var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SourceModelSchema = new Schema({
  a_string: String,
  a_date: Date,
});

module.exports = mongoose.model('SourceModel', SourceModelSchema);