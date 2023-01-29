const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide a Name'],
			maxlegth: [40, 'Name should be under 40 characters']
		},
		email: {
			type: String,
			required: [true, 'Please provide an Email'],
			unique: true,
			validate: [validator.isEmail, 'Please enter email is correct format']
		},
		password: {
			type: String,
			required: [true, 'Please provide an password'],
			minlength: [8, 'password should be atleast 6 characters'],
			select: false
		},
		role: {
			type: String,
			default: 'user'
		},
		photo: {
			id: {
				type: String,
				required: true
			},
			secure_url: {
				type: String,
				required: true
			}
		},
		forgotPasswordToken: String,
		forgotPasswordExpiry: Date,
		shippingInfo: {
			type: Object
		},
		orderHistory: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Order',
				required: true
			}
		]
	},
	{ timestamps: true }
);

// incrypt password before save -HOOK

userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 10);
});

// validate the password with passed on user password

userSchema.methods.IsvalidPassword = async function(passwordFromUser) {
	return await bcrypt.compare(passwordFromUser, this.password);
};

// create and return jwt token

userSchema.methods.getJwtToken = function() {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY
	});
};

// generate forgot password token

userSchema.methods.getForgotPasswordToken = function() {
	// generate a long and randomg string
	const forgotToken = crypto.randomBytes(20).toString('hex');

	// getting a hash - make sure to get a hash on backend
	this.forgotPasswordToken = crypto
		.createHash('sha256')
		.update(forgotToken)
		.digest('hex');

	//time of token

	this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

	return forgotToken;
};

module.exports = mongoose.model('User', userSchema);
