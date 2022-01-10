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
        address: {
            type: Object,
            required: ['borough', 'zipcode'],
            properties: {
                neighborhood: {
                    type: String,
                    description: 'must be a string if the field exists'
                },
                borough: {
                    type: String,
                    description: "must be a string and is required"
                },
                zipcode: {
                    type: Number,
                    description: "must be a number and is required"
                }
            }
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