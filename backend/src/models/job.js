const mongoose = require('mongoose');
const { timeStamp } = require('console');

const Applicant = {
  name: String,
  email: String,
  link: String,
  date1: Date,
  date2: Date,
  timing: String,
  status: String
}

const jobSchema = mongoose.Schema({
  postedBy: { type: String, required: true },
  designation: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: Array, required: true },
  experience: { type: String, required: true },
  applications: { type: [Applicant], default: [] },
  time1: { type: String, required: true },
  time2: { type: String, required: true }
})

module.exports = mongoose.model('Job', jobSchema);
