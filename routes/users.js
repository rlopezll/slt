var express = require('express');
var router = express.Router();
const passport = require('passport');
const auth = require('../auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource uniqueId: ' + req.sessionID);
});

router.get('/create', function(req, res, next) {
  res.render('user');
});

// create the login get and post routes
router.get('/login', (req, res) => {
  res.render('login');
  // console.log('Inside GET /login callback function')
  // console.log(req.sessionID)
  // res.send(`You got the login page!\n`)
});

router.post('/login', (req, res, next) => {
  console.log('Inside POST /login callback function');
  // console.log(req);
  passport.authenticate('local', { failureRedirect: '/users/login' }, (err, user, info) => {
    console.log('Inside passport.authenticate() callback');
    if(err || !user) {
      console.log(`passport.authenticate() err: ${err}`);
      return res.redirect('/users/login');
    }
    // res.json({ user: user.toAuthJSON() });
    // if(!req.session.passport)
    // {
    //   console.log(`passport.authenticate() req.session.passport: null`);
    //   return res.redirect('/users/login');
    // }
    // console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
    // console.log(`req.user: ${JSON.stringify(req.user)}`);
    
    req.login(user, (err) => {
      console.log('Inside req.login() callback');
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
      console.log(`req.user: ${JSON.stringify(req.user)}`);
      if(err) {
        console.log(`req.login err: ${err}`);
      }
      console.log('You were authenticated & logged in!');
      // const user = passportUser;
      // user.token = passportUser.generateJWT();
      // res.json({ user: user.toAuthJSON() });
      return res.redirect('/abc');
      // return res.send('You were authenticated & logged in!\n');
    })
  })(req, res, next);
})

// create the login get and post routes
router.get('/logout', (req, res) => {
  req.logout();  
  req.session.destroy(function (err) {
    if(err) {
      console.log(`req.session.destroy err: ${err}`);
    } else {
      res.clearCookie('my.connect.sid');
      console.log('logout all ok!');
    }
    // req.session.passport.user = null;
    res.redirect('/users/login');
  });
});

module.exports = router;
