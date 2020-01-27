var express = require('express');
var router = express.Router();
const auth = require('../auth');
var Project = require('../models/project');
var ConfigSLT= require('../config');

/* GET home page. */
router.get('/create', auth.restrict, function(req, res, next) {
  var all_langs = ConfigSLT.get_all_langs();  
  res.render('project', { session: req.session, all_langs:all_langs });
});

router.post('/create', function(req, res, next) {
  console.log('post create');
  var creation_date = Date.now();
  var use_qa_review = false;
  if(req.body.use_qa_review)
    use_qa_review = true;
  var sections = [];
  var langs = [];
  var all_langs = ConfigSLT.get_all_langs();
  console.log(all_langs);
  for(curr_idx in all_langs) {
    var curr_lang = all_langs[curr_idx];
    var element_checkbox_name = 'lang_' + curr_lang.code;
    var is_checked = req.body[element_checkbox_name];
    if(is_checked) {
      langs.push(curr_lang.code);
    }
  }
  var projectData = {internal_name:req.body.internal_name, display_name:req.body.project_name, desc:req.body.desc, use_qa_review:use_qa_review, creation_date:creation_date, sections:sections, langs:langs};
  var new_project = new Project(projectData);
  new_project.save(function(err){
    if(err) {
      console.log("Error when create new project error: " + err);
      return;
    }
    console.log('New project: ' + new_project);    
    return res.redirect('/');
  });
});

router.get('/edit/:unique_id', auth.restrict, function(req, res, next) {
  console.log('Project params: ' + req.params.unique_id);

  Project.findOne({_id:req.params.unique_id},'', function(err,project_db) {
    if(err) {
      console.log("Error DB: " + err);
      next();
    }
    else {
      var all_langs = ConfigSLT.get_all_langs_actived(project_db.langs);  
      var project = {id:project_db._id,project_name:project_db.display_name,internal_name:project_db.internal_name,use_qa_review:project_db.use_qa_review,sections:project_db.sections,desc:project_db.desc};
      res.render('project', { session: req.session, project:project,all_langs:all_langs });
    }
  });

});

router.post('/edit', function(req, res, next) {
  res.render('project', { session: req.session });
});

router.get('/delete/:unique_id', auth.restrict, function(req, res, next) {
  // console.log('Project params: ' + req.params.unique_id);
  Project.updateOne({_id:req.params.unique_id}, {enabled:0}, function(err) {
    if(err) {
      console.log("Error DB: " + err);
      next();
    }
    console.log('Disable project: ' + req.params.unique_id);    
    return res.redirect('/');
  });
});

module.exports = router;
