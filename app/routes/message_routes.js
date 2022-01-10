const express = require('express')
const passport = require('passport')

const User = require('../models/user')

const requireToken = passport.authenticate('bearer', { session: false })
const requireOwnership = customErrors.requireOwnership

const router = express.Router()

