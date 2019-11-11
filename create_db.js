//Set up mongoose connection
var mongoose = require('mongoose');
var async = require('async');
var model_source = require('./models/source');

var mongoDB = 'mongodb://127.0.0.1/locale_db';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

mongoose.connection.close();
