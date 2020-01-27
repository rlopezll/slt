var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const uuid = require('uuid/v4')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/locale_db';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

// app.use(function (req, res, next) {
//   res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//   res.header('Expires', '-1');
//   res.header('Pragma', 'no-cache');
//   next();
// });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectsRouter = require('./routes/projects');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// add & configure middleware 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  genid: (req) => {
    // console.log('Inside the session middleware')
    // console.log(req.sessionID)
    return uuid() // use UUIDs for session IDs
  },
  name: 'my.connect.sid',
  store: new FileStore(),
  secret: 'F00RAfIs5yW6CEsVUXM25aMclq7VGzxVno',
  resave: false, // don't save session if unmodified
  saveUninitialized: false // don't create session until something stored
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log('Error! msg:' + err.message);
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
