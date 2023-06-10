// models/recipe.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyName: {type: String, required: true},
  position: {type: String, required: true},
  monthlySalary: {type: Number, required: true},
  jobType: {type: String, required: true},
  internshipDuration: String,
  workingMode: {type: String, required: true},
  jobDescription: {type: String, required: true},
  aboutCompany: {type: String, required: true},
  skills: {type: Array, required: true},
  logo: String,
  location: String,
});

module.exports = mongoose.model('Job', jobSchema);