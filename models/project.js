var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubSectionSchema = new Schema({ name: String });
var SectionSchema = new Schema({ name: String }, {sub_sections: [SubSectionSchema] });

var ProjectSchema = new Schema({
  internal_name: {type: String, required: true},
  display_name: {type: String, required: true},
  desc: {type: String, required: true},
  langs: {type: Array, required: true},
  use_qa_review: {type: Boolean, required: true},
  creation_date: {type: Date, required: true},
  last_update_date: {type: Date, default: Date.now},
  enabled: {type: Boolean, required: true, default:true},  
  sections: [SectionSchema],
});

module.exports = mongoose.model('ProjectModel', ProjectSchema);