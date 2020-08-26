const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const User = require('./../models/user')
const user = require('./../models/user')

const authRouter = express.Router()

authRouter.use(bodyParser.json())

authRouter.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const fetchedUser = await User.findOne({ email })
    if (!fetchedUser) {
      return res.status(400).json({
        message: "Invalid credentials..."
      })
    }


    const passwordMatch = await bcrypt.compare(password, fetchedUser.password)
    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid credentials..."
      })
    }

    const id = fetchedUser._id;
    const token = jwt.sign({ id }, process.env.JWT_STRING)
    res.status(200).json({
      token,
      admin: fetchedUser.adminAccess
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid credentials...',
    })
  }
})

authRouter.post('/register', async (req, res) => {
  const password = req.body.password
  const confirm = req.body.confirmPassword
  if (password !== confirm) {
    res.status(400).json({
      message: 'Passwords mismatch...'
    })
  }
  try {
    const hash = await bcrypt.hash(password, 8)
    const user = new User({
      email: req.body.email,
      password: hash,
      adminAccess: false
    })

    const response = await user.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_STRING)
    res.status(201).json({
      token,
      admin: response.adminAccess
    });
  } catch (error) {
    res.status(400).json({
      message: 'Email already exits...'
    })
  }
})

authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { id } = jwt.verify(token, process.env.JWT_STRING)
    const user = await User.findById(id)
    if (!user) {
      throw new Error()
    }
    req.user = user
    next()
  } catch {
    res.status(400).json({
      message: 'Authentication denied...',
    })
  }
}
module.exports = { authRouter, authenticate }
