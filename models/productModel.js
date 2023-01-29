const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, 'please provide a product name '],
			trim: true,
			maxlength: [120, 'product name shoud not be more then 120 characters']
		},
		price: {
			type: Number,
			require: [true, 'please provide product price ']
		},
		description: {
			type: String,
			require: [true, 'please provide product description ']
		},
		photos: [
			{
				id: {
					type: String,
					required: true
				},
				secure_url: {
					type: String,
					required: true
				}
			}
		],
		category: {
			type: String,
			required: [true, 'please select a category'],
			enum: {
				values: ['men', 'women', 'kids'],
				message: 'please select category '
			}
		},
		brand: {
			type: String,
			required: [true, 'please provide product brand']
		},
		rating: {
			type: Number,
			default: 0
		},
		numberOfReviews: {
			type: Number,
			default: 0
		},
		reviews: [
			{
				user: {
					type: mongoose.Schema.ObjectId,
					ref: 'User',
					required: true
				},
				name: {
					type: String,
					required: true
				},
				rating: {
					type: Number,
					required: true
				},
				Comment: {
					type: String,
					required: true
				}
			}
		],
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true
		},
		stock: {
			type: Number,
			default: 1,
			required: [true, 'please provide number of stock']
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
