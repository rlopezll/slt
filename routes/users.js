var express = require('express');
var router = express.Router();

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
})

router.post('/login', (req, res) => {
  console.log('Inside POST /login callback function')
  console.log(req.body)
  res.send(`You posted to the login page!\n`)
})

module.exports = router;
