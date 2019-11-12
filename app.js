var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const uuid = require('uuid/v4')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const users = [
  {id: '2f24vvg', username: 'admin', password: '1234'}
]

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    // console.log('Inside local strategy callback');
    // console.log(`passport.serializeUser username: ${username}`);
    // console.log(`passport.serializeUser password: ${password}`);

    // here is where you make a call to the database
    // to find the user based on their username or email address
    // for now, we'll just pretend we found that it was users[0]
    const user = users[0];
    if(username === user.username && password === user.password) {
      // console.log('Local strategy returned true');
      return done(null, user);
    } else {
      console.log('Error!! Login Failed!');
      // console.log(username.user);
      return done(null, false, { message: 'Login Failed.' });
    }
  }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  console.log('Inside serializeUser callback. User id is save to the session file store here')
  console.log(`passport.serializeUser user: ${JSON.stringify(user)}`);
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// add & configure middleware 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  genid: (req) => {
    // console.log('Inside the session middleware')
    // console.log(req.sessionID)
    return uuid() // use UUIDs for session IDs
  },
  name: 'my.connect.sid',
  store: new FileStore(),
  secret: 'F00RAfIs5yW6CEsVUXM25aMclq7VGzxVno',
  resave: false,
  saveUninitialized: true
})) 

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
