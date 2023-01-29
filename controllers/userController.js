const BigPromise = require('../middlewares/bigPromise');
const customError = require('../utils/customError');
const userModel = require('../models/userModel');
const cookieToken = require('../utils/cookieToken');
const mailHelper = require('../utils/emailHelper');
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');

exports.signUp = BigPromise(async (req, res, next) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return next(new customError('please provide all fileds', 400));
	}
	const isExistingUser = await userModel.findOne({ email });

	if (isExistingUser) {
		return res.status(404).json({
			success: false,
			message: 'User Already Exist'
		});
	}

	let result;
	// uploading photo to cloudinary and geting back url and Id in response then storing it in result

	if (req.files) {
		let file = req.files.photo;
		//console.log(file);
		result = await cloudinary.uploader.upload(file.tempFilePath, {
			folder: 'users'
		});
	} else {
		result = {
			public_id: 'users/oaqokponzynauvjoc3mv',
			secure_url:
				'https://res.cloudinary.com/dfbd4lyqe/image/upload/v1662800728/users/dumy/sampleImage_qroybc.png'
		};
	}

	const user = await userModel.create({
		name,
		email,
		password,
		photo: {
			id: result.public_id,
			secure_url: result.secure_url
		}
	});

	cookieToken(user, res);
});

exports.logIn = BigPromise(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new customError('please provide email and password'), 400);
	}
	const user = await userModel.findOne({ email }).select('+password');

	if (!user) {
		return next(new customError('user does not exist', 400));
	}

	const isPosswordValid = await user.IsvalidPassword(password);
	if (!isPosswordValid) {
		return next(new customError('invalid password '), 400);
	}
	user.password = undefined;
	cookieToken(user, res);
});

exports.logOut = BigPromise(async (req, res, next) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true
	});

	res.status(200).json({
		success: true,
		message: 'user logout successfully'
	});
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
	const { email } = req.body;

	const user = await userModel.findOne({ email });

	if (!user) {
		return next(new customError('user do not exist'), 400);
	}
	const forgetToken = await user.getForgotPasswordToken();

	await user.save({ validateBeforeSave: false });

	const url = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/password/reset/${forgetToken}`;

	const message = `click on the link t reset password \n\n ${url}`;

	try {
		await mailHelper({
			email: user.email,
			message,
			url,
			subject: 'password reset email'
		});

		res.status(200).json({
			success: true,
			message: 'email send successfully'
		});
	} catch (error) {
		user.forgotPasswordExpiry = undefined;
		user.forgotPasswordToken = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new customError(error.message, 500));
	}
});

exports.restPassword = BigPromise(async (req, res, next) => {
	const { password, confirmPassword } = req.body;

	const token = req.params.token;

	const encrypedToken = crypto.createHash('sha256').update(token).digest('hex');

	const user = await userModel.findOne({
		encrypedToken,
		forgotPasswordExpiry: { $gt: Date.now() }
	});

	if (!user) {
		return next(new customError('token is invalid  pr expire', 400));
	}

	if (password !== confirmPassword) {
		return next(
			new customError('password and confirmPassword do not match'),
			400
		);
	}

	user.password = password;

	user.forgotPasswordExpiry = undefined;

	user.forgotPasswordToken = undefined;

	await user.save();

	cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
	const user = await userModel.findById(req.user.id);

	//send response and user data
	res.status(200).json({
		success: true,
		user
	});
});

exports.updatePassword = BigPromise(async (req, res, next) => {
	const { newPassword, oldPassword } = req.body;

	const userId = req.user.id;
	const user = await userModel.findById(userId).select('+password');
	const isOldPasswordCorrect = user.IsvalidPassword(oldPassword);

	if (!isOldPasswordCorrect) {
		return next(
			new customError(
				'password does not metch please provide correct password'
			),
			400
		);
	}

	user.password = newPassword;
	await user.save();
	cookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
	const userId = req.user.id;
	const newData = {
		name: req.body.name,
		email: req.body.email
	};
	//console.log(req.files['photo.0'])
	
	if (req.files) {
		const user = await userModel.findById(userId);
		const imageId = user.photo.id;

		// delete photo on cloudnari
		dumyImageUrl =
			'https://res.cloudinary.com/dfbd4lyqe/image/upload/v1662800728/users/dumy/sampleImage_qroybc.png';
		if (user.photo.secure_url !== dumyImageUrl) {
			const response = await cloudinary.uploader.destroy(imageId);
			console.log(response, ' deleted');
		}

		let file = req.files['photo.0'];
		console.log(file);
		result = await cloudinary.uploader.upload(file.tempFilePath, {
			folder: 'users'
		});

		newData.photo = {
			id: result.public_id,
			secure_url: result.secure_url
		};
	}

	const user = await userModel.findByIdAndUpdate(userId, newData, {
		new: true,
		runValidators: true
	});
	res.status(200).json({
		success: true,
		user
	});
});

exports.updateUserShippingInfo = BigPromise(async (req, res, next) => {
	const userId = req.user.id;
	//console.log(req.body);
	const user = await userModel.findById(userId);
	user.shippingInfo = req.body;
	const updatedUserDetails = await user.save();
	//	console.log(updatedAddress);
	res.status(200).json({ success: true, updatedUserDetails });
});

exports.adminAllUser = BigPromise(async (req, res, next) => {
	const users = await userModel.find();

	res.status(200).json({
		success: true,
		users
	});
});

exports.managerAllUser = BigPromise(async (req, res, next) => {
	const users = await userModel.find({ role: 'user' });

	res.status(200).json({
		success: true,
		users
	});
});

exports.adminGetOneUser = BigPromise(async (req, res, next) => {
	const { id } = req.params;

	const user = await userModel.findById(id);
	if (!user) {
		return next(new customError('user not found'), 400);
	}
	res.status(200).json({
		success: true,
		user
	});
});

exports.adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {
	const { id } = req.params;
	const { name, email, role } = req.body;

	if (!name || !email || !role) {
		return next(new customError('please provide all fields '), 400);
	}

	const newData = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role
	};

	const user = await userModel.findByIdAndUpdate(id, newData, {
		new: true,
		runValidators: true
	});
	res.status(200).json({
		success: true,
		user
	});
});

exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {
	const { id } = req.params;

	if (!id) {
		return next(new customError('no user selected'), 400);
	}

	const user = await userModel.findById(id);
	if (!user) {
		return next(new customError('user does not exist'), 400);
	}
	const imageId = user.photo.id;
	console.log(imageId);
	// delete photo on cloudnari
	dumyImageUrl =
		'https://res.cloudinary.com/dfbd4lyqe/image/upload/v1662800728/users/dumy/sampleImage_qroybc.png';

	if (user.photo.secure_url !== dumyImageUrl) {
		await cloudinary.uploader.destroy(imageId);
	}

	await user.remove();

	res.status(200).json({
		success: true,
		message: 'user deleted successfully'
	});
});
