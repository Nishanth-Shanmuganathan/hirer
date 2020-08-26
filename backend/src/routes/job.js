const path = require('path')

const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const multer = require('multer')

const User = require('./../models/user')
const Job = require('./../models/job')

const MIME_TYPE_MAP = {
  "application/pdf": "pdf",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid file type");
    if (isValid) {
      error = null;
    }
    cb(error, "resume");
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    const filename = req.body.jobId + '_' + req.user._id + "." + ext
    const absPath = "https://hirer.herokuapp.com/resume/" + filename
    req.body.absPath = absPath
    cb(null, filename);
  }
});

const jobRouter = express.Router()

jobRouter.use(bodyParser.json())

jobRouter.post('/', async (req, res) => {
  const { adminAccess } = req.user
  try {
    const job = new Job({
      postedBy: req.body.postedBy,
      designation: req.body.designation,
      description: req.body.description,
      skills: req.body.skills,
      experience: req.body.experience,
      time1: req.body.time1,
      time2: req.body.time2,
    })
    await job.save()
    res.status(200).send({
      job
    })
  } catch (error) {
    res.status(400).send({
      message: 'Unable to add new job'
    })
  }

})

jobRouter.get('/', async (req, res) => {
  try {
    const documents = await Job.find({})
    let jobs;
    if (req.user.adminAccess === false) {
      jobs = documents.filter(doc => !req.user.applications.includes(doc._id))
    } else {
      jobs = documents
    }

    jobs.forEach(job => {
      job.applications.forEach(application => {
        let date;
        if (new Date(application.date1).getTime() > Date.now()) {
          date = application.date1
        } else {
          if (new Date(application.date2).getTime() > Date.now()) {
            date = application.date2
          } else {
            application.status = "expired"
          }
        }
        application.timing = new Date(date).toLocaleDateString() + ' ' + job.time1 + '-' + job.time2
        if (application.timing.includes('Invalid Date')) {
          application.timing = '-'
          application.status = "expired"
        }
        if (!application.status) {
          application.status = 'scheduled'
        }
      })
    })
    res.status(200).send({ jobs })
  } catch (error) {
    res.status(400).send({ message: 'Unable to fetch jobs' })
  }
})

jobRouter.post('/apply', multer({ storage }).single('resume'), async (req, res) => {
  const { adminAccess, email } = req.user
  const user = req.user
  const { name, jobId, date1, date2 } = req.body
  try {
    if (adminAccess === "true") {
      throw new Error()
    }
    if (user.applications.includes(jobId)) { throw new Error() }
    user.applications.push(jobId)

    const job = await Job.findById(req.body.jobId)
    const applicationDetails = { name, email, link: req.body.absPath, date1, date2 }
    job.applications.push(applicationDetails)

    await user.save()
    await job.save()

    res.status(200).send({
      message: "Applied successfully"
    })
  } catch (error) {
    res.status(400).send({
      message: 'Unable to apply'
    })
  }
})

jobRouter.get('/change', async (req, res) => {
  const user = req.user
  user.adminAccess = !user.adminAccess
  try {
    await user.save()
    res.status(200).send({
      admin: user.adminAccess
    })
  } catch (error) {
    (error);
    res.status(400).send({
      message: 'Unable to change perspective'
    })
  }
})

module.exports = { jobRouter }
