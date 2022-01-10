const express = require('express')
const passport = require('passport')

const Tag = require('../models/tag')
const User = require('../models/user')

const customErrors = require('../../lib/custom_errors')
const handle404= customErrors.handle404

const removeBlanks = require('../../lib/remove_blank_fields')
const tag = require('../models/tag')
const apartment = require('../models/apartment')

const requireToken = passport.authenticate('bearer', { session: false })
const requireOwnership = customErrors.requireOwnership

const router = express.Router()

// INDEX
// GET /tags
router.get('/tags', requireToken, (req, res, next) => {
    Tag.find()
    .then((tags) => {
        return tags.map((tag) => tag.toObject())
    })
    .then((tags) => res.status(200).json({ tags: tags }))
    .catch(next)
})

// SHOW
// GET/ tags/5a7db6c74d55bc51bdf39793

router.get('/tags/:id', requireToken, (req, res, next) => {
    Tag.findById(req.params.id)
    .then(handle404)
    .then((tag) => res.status(200).json({ tag: tag.toObject()}))
    .ctach(next)
})

// SHOW
// GET apartments/tagId
// router.get('/tags/:id', requireToken, (req, res, next) => {
//     Tag.findById(req.params.id)
//     .then(handle404)
//     .then((tag) => res.status(200).json({ tag: tag.toObject()}))
//     .catch(next)
// })

// CREATE
// Post /tag
router.post('/tags', requireToken, (req, res, next) => {
    req.body.tag.owner = req.user.id
    Tag.create(req.body.tag)
    .then((tag) => { 
        res.status(201).json({ tag: tag.toObject()})
    })
    .catch(next)
})

// UPDATE
// PATCH /apartmentId/tags
router.patch('/:apartmentId/tags', requireToken, (req, res, next) => {
    delete req.body.tag.owner

    Tag.findById(req.params.id)
    .then(handle404)
    .then((tag) => {
        requireOwnership(req, tag)
        return tag.updateOne(req.body.tag)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
//     Apartment.findByIdAndUpdate(apartmentId, {
//         $push: {
//             tags: tag._id
//         }}, 
//         {
//             new: true,
//             useFindAndModify: false
//         }
        
//     )
    
// })
    // req.body.tag.apartments.push(req.params.apartmentId)
	// Tag.find(req.body.tag)
	// 	// respond to succesful `create` with status 201 and JSON of new "tag"
	// 	.then((tag) => {
    //         console.log('THIS IS FOUND TAG', tag)
    //         apartment.findById(req.params.apartmentId)
    //             .then(foundApartment => {
    //                 foundApartment.tags.push(tag._id)
    //                 foundApartment.save()
    //                 res.status(201).json({ tag: tag.toObject() })
    //             })
	// 	})
	// 	.catch(next)
})

// UPDATE
// PATCH /tags/5a7db6c74d55bc51bdf39793
router.patch('/tags/:id', requireToken, removeBlanks, (req, res, next) => {
    delete req.body.tag.owner

    Tag.findById(req.params.id)
    .then(handle404)
    .then((tag) => {
        requireOwnership(req, tag)
        return tag.updateOne(req.body.tag)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /tags/5a7db6c74d55bc51bdf39793
router.delete('/tags/:id', requireToken, (req, res, next) => {
	Tag.findById(req.params.id)
		.then(handle404)
		.then((tag) => {
			requireOwnership(req, tag)
			tag.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router