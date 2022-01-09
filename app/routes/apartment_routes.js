const express = require('express')
const passport = require('passport')

const Apartment = require('../models/apartment')
const User = require('../models/user')

const customErrors = require('../../lib/custom_errors')
const handle404= customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const apartment = require('../models/apartment')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /apartments
router.get('/apartments', requireToken, (req, res, next) => {
    Apartment.find()
    .then((apartments) => {
        return apartments.map((apartment) => apartment.toObject())
    })
    .then((apartments) => res.status(200).json({ apartments: apartments }))
    .catch(next)
})

// SHOW
// GET/ apartments/5a7db6c74d55bc51bdf39793

router.get('/apartments/:id', requireToken, (req, res, next) => {
	Apartment.findById(req.params.id)
		.then(handle404)
		.then((apartment) => res.status(200).json({ apartment: apartment.toObject() }))
		.catch(next)
})

// CREATE
// POST /apartments

router.post('/apartments', requireToken, (req, res, next) => {
    req.body.apartment.owner = req.user.id

    Apartment.create(req.body.apartment)
    .then((apartment) => { 
        res.status(201).json({ apartment: apartment.toObject()})
    })
    .catch(next)
})

// UPDATE
// PATCH /apartments/5a7db6c74d55bc51bdf39793
router.patch('/apartments/:id', requireToken, removeBlanks, (req, res, next) => {
    delete req.body.apartment.owner

    Apartment.findById(req.params.id)
    .then(handle404)
    .then((apartment) => {
        requireOwnership(req, apartment)
        return apartment.updateOne(req.body.apartment)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /apartments/5a7db6c74d55bc51bdf39793
router.delete('/apartments/:id', requireToken, (req, res, next) => {
    Apartment.findById(req.params.id)
    .then(handle404)
    .then((apartment) => {
        requireOwnership(req, apartment)
        apartment.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router