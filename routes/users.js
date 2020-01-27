var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');
const auth = require('../auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource uniqueId: ' + req.sessionID);
});

router.get('/create', function(req, res, next) {
  res.render('user');
});

router.post('/create', function(req, res, next) {

  //Check if user exists
  User.findOne({'username':req.body.username},'_id', function(err,user_db) {
    console.log('User.find inside.');
    if(err) {
      console.log("Error DB: " + err);
      next();
    }
    else {
      if(user_db) {
        console.log('req.body.username:' + req.body.username + ' exists!!');
        var err = { invalid_username:1 };
        res.render('user',{ err: err });
      } else {
        console.log('req.body.username:' + req.body.username + ' all ok!!');
        var BCRYPT_SALT_ROUNDS = 12;
        bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)
        .then(function(hashedPassword) {
          var userData = {username:req.body.username, password:hashedPassword, display_name:req.body.realname, email:req.body.email};
          var new_user = new User(userData);
          new_user.save(function(err){
            if(err) {
              console.log("Error when create new user");
              return;
            }
            console.log('New user: ' + new_user);    
            return res.redirect('/');
          });
        });
      }
    }
  });

});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  console.log('req.body.username:' + req.body.username);
  console.log('req.body.password:' + req.body.password);
  auth.authenticate(req.body.username, req.body.password, function(err, user){
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('/');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      res.redirect('/users/login');
    }
  });
});

// create the login get and post routes
router.get('/logout', (req, res) => {
  console.log('user logout');
  req.session.destroy(function (err) {
    if(err) {
      console.log(`req.session.destroy err: ${err}`);
    } else {
      res.clearCookie('my.connect.sid');
      console.log('logout all ok!');
    }
    res.redirect('/users/login');
  });
});

module.exports = router;
