var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  creation_date: {type: Date, default: Date.now},
  display_name: {type: String, required: true},
  email: {type: String, required: true},
});

module.exports = mongoose.model('UserModel', UserSchema);