const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true
		},
        apartments: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Apartment'
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
	}
)

module.exports = mongoose.model('Tag', tagSchema)