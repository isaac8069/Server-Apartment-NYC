const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
	{
		from: {
			type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
		},
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sent: {
            type: Date,
        },
        message: {
            type: String,
        }
	}
)

module.exports = mongoose.model('Message', messageSchema)