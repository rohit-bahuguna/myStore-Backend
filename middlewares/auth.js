const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const BigPromise = require('./bigPromise');
const customError = require('../utils/customError');

exports.isLoggedIn = BigPromise(async (req, res, next) => {
	let token = req.cookies.token; //  || req.header('Authorization').replace('Bearer ', '');

	if (!token) {
		return next(new customError('token is missing please login first'));
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	req.user = await userModel.findById(decoded.id);
	next();
});

exports.customRole = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new customError('You are not allow to access this resource'),
				403
			);
		}
		next();
	};
};
