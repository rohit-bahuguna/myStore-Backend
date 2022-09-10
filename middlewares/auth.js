const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const BigPromise = require('./bigPromise');
const customError = require('../utils/customError');

const isLoggedIn = BigPromise(async (req, res, next) => {
	let token = req.cookies.token; //  || req.header('Authorization').replace('Bearer ', '');

	if (!token) {
		return next(new customError('token is missing please login first'));
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	req.user = await userModel.findById(decoded.id);
	next();
});

module.exports = isLoggedIn;
