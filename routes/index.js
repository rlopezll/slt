var express = require('express');
var router = express.Router();
const auth = require('../auth');
var Project = require('../models/project');
var ConfigSLT= require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
  var projects = [];
  if(req.session && req.session.user && req.session.user.token) {
    console.log('Finding projects');
    Project.find({},'_id internal_name display_name use_qa_review enabled langs', function(err,project_db) {
      // console.log('User.find inside.');
      if(err) {
        console.log("Error DB: " + err);
        next();
      }
      else {
        project_db.forEach(element => {
          var all_langs = ConfigSLT.get_all_langs_actived(element.langs);  
          var project_obj = {id:element._id, internal_name:element.internal_name, display_name:element.display_name, use_qa_review:element.use_qa_review, desc:element.desc, enabled:element.enabled, all_langs:all_langs};          
          projects.push(project_obj);
          console.log("Project internal_name: " + element.internal_name + " display_name: " + element.display_name + " enabled: " + element.enabled);
          if(element.enabled)
            console.log(element.langs);
        });
        res.render('index', { session: req.session, projects:projects });
      }
    });
  } else {
    console.log('No User logged');
    res.render('index', { session: req.session, projects:projects });
  }
});

router.get('/abc', auth.restrict, function(req, res, next) {
  res.send('Hello World');
});


module.exports = router;
