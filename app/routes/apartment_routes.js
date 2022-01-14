const express = require('express')
const passport = require('passport')

const Apartment = require('../models/apartment')
const User = require('../models/user')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json

const removeBlanks = require('../../lib/remove_blank_fields')
const cloudinary = require('cloudinary')
const multer = require('multer')
const Tag = require('../models/tag')
const user = require('../models/user')
const upload = multer({ dest: './uploads/' })

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX All Apartments
// GET /apartments
router.get('/apartments', (req, res, next) => {
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


// SHOW All User Apartments
// GET apartments/userId
router.get('/apartments/user/:id', requireToken, (req, res, next) => {
  console.log('USER:', req.user.id)
      Apartment.find()
        .then((apartments) => {
          const userApts = apartments.filter(apt => apt.owner == req.user.id)
          return userApts.map((apartment) => apartment.toObject())
        })
        .then((apartments) => res.status(200).json({ apartments: apartments }))
        .catch(next)
    })
// })

// router.get('/apartments/user/:id', (req, res, next) => {
//   console.log('THIS IS THE OWNER:', owner)
//   User.findById(owner)
//     .then(foundUser)
// })


// CREATE
// POST /apartments

router.post('/apartments', requireToken, (req, res, next) => {
  console.log('USERid', req.user.id)
  req.body.apartment.owner = req.user.id
  console.log('APARTMENTowner', req.body.apartment.owner)
  Apartment.create(req.body.apartment)
    .then((apartment) => {
      res.status(201).json({ apartment: apartment.toObject() })
    })
    .catch(next)
})

// Find apartment and push a tag in the tag array within apartment
router.post('/tags/:apartmentId', (req, res, next) => {
  console.log('REEQBODY', req.params)
  Apartment.findById(req.params.apartmentId)
    .then(foundApartment => {
      console.log('APT?', foundApartment)
      // add (push) the new tag into the apartment's tags array
      foundApartment.tags.push(req.body)
      // then I'll need to save the apartment
      return foundApartment.save()
    })
    // after that we can return the apartment and send the status with some JSON
    .then(updatedApartment => {
      Tag.findById(req.body._id)
        .then(foundTag => {
          foundTag.apartments.push(updatedApartment)
          return foundTag.save()
        })
        .then(updatedTag => {
          res.status(201).json({ updatedTag: updatedTag, updatedApartment: updatedApartment })
        })
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

// SEARCH FOR AN APARTMENT USING LOCATION
// router.get('/', (req, res, next) => {
//     console.log('SEARCH ROUTE')
//     console.log(req.query.apartment.address.zipcode)
//     Apartment.findAll(req.params.apartment.address.zipcode)
//     .then(handle404)
//     .then((apartments) => {
//         return apartments.map((apartment) => apartment.toObject())
//     })
//     .then((apartments) => res.status(200).json({ apartments: apartments }))
//     .catch(next)
// })



////////////// CODE FROM P2 to reference //////////////
// POST - CLOUDINARY  UPLOAD
router.post('/image', upload.single('myFile'), function (req, res) {
  cloudinary.uploader.upload(req.file.path, function (result) {
    // console.log('image page works')
    // console.log(result)
    // console.log('This should be the image', result.url)
  })
    .then(image => {
      const apartment = req.body
      // console.log('This should be the apartment body', apartment)
      // console.log('This should be apartment and image', image)
      res.render('apartments/update', { apartment: apartment, image: image.url })
    })
})

// PUT - CONFIRM FINAL IMAGE
router.put('/:id/update', (req, res) => {
  console.log('Should be whole apartment', req.body)
  db.apartment.update({
    title: req.body.title,
    rent: req.body.rent,
    description: req.body.description,
    location: req.body.location,
    bedrooms: req.body.bedrooms,
    bathrooms: req.body.bathrooms,
    amenities: req.body.amenities,
    roommates: req.body.roommates,
    image: req.body.image
  }, { where: { id: req.params.id } })
    .then(updatedApartment => {
      console.log(`new apartment UPDATED: ${updatedApartment}`)
      res.redirect(`/apartment/${req.params.id}`)
    })
    .catch(error => console.error)
})
////////////////////////////////////////////////////////////

module.exports = router