const mongoose = require('mongoose')

const apartmentSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        rent: {
            type: Number,
            required: true
        },
        description: {
            type: String,
        },
        neighborhood: {
            type: String,
        },
        borough: {
            type: String,
        },
        zipcode: {
            type: String,
            required: true
        },
        bedrooms: {
            type: Number,
            required: true
        },
        bathrooms: {
            type: Number,
            required: true
        },
        amenities: {
            type: String,
        },
        roommates: {
            type: Number,
            required: true
        },
        tags: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Tag'
        },
        imgUrl: {
            type: String,
        }
    }
)

module.exports = mongoose.model('Apartment', apartmentSchema)