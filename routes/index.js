var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
  console.log('BaseUrl:', req.path);
  if(req.path === '/' || req.path === '/users/login')
  {
    next();
  } else {
    if(req.session.passport)
    {
      console.log('Has req.session.passport');
      next();
    } else {
      console.log('NO req.session.passport REDIRECT');
      res.redirect('/users/login');
    }
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/abc', function(req, res, next) {
  res.send('Hello World');
});


module.exports = router;
