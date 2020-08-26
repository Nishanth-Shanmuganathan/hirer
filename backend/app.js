const path = require('path')

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const { authRouter, authenticate } = require('./src/routes/authentication')
const { jobRouter } = require('./src/routes/job')

const app = express()
app.use('/resume', express.static('resume'))

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

app.use('/authentication', authRouter)
app.use('/job', authenticate, jobRouter)

app.use('/', express.static(path.join(__dirname, 'Hirer')))

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'Hirer', 'index.html'))
})

mongoose.connect(process.env.DB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(res => {
    app.listen(process.env.PORT)
    console.log('Server listening at port : ' + process.env.PORT);
  })
  .catch(err => {
    console.log('Connection to database failed...');
  })
