const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
	{
		cartItem: [
			{
				type: Object,

				required: true
			}
		],
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{ timestamp: true }
);

module.exports = mongoose.model('Cart', cartSchema);
