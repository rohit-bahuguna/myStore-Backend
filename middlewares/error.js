const CustomError = require('../utils/customError');

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	if (process.env.NODE_ENV === 'DEVELOPMENT') {
		res.status(err.statusCode).json({
			success: false,
			error: err,
			errMessage: err.message,
			stack: err.stack
		});
	}

	if (process.env.NODE_ENV === 'PRODUCTION') {
		let error = { ...err };
		error.message = err.message;

		// Wrong mongoose object Id Error
		if (err.name === 'CastError') {
			const message = `Resource not found, Invalid: ${err.path}`;
			error = new CustomError(message, 400);
		}

		// Handling Mongoose validation Error     (if required path is not given)
		if (err.name === 'ValidationError') {
			const message = Object.values(err.errors).map(value => value.message);
			error = new CustomError(message, 400);
		}

		// Handling mongoose duplicate key Error (cheating account with same email)
		if (err.code === 11000) {
			const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
			error = new CustomError(message, 400);
		}

		// Handling wrong JWT error
		if (err.name === 'JsonWebTokenError') {
			const message = 'JSON Web token not valid, Please try again!!!';
			error = new CustomError(message, 400);
		}

		// Handling Expire JWT error
		if (err.name === 'TokenExpiredError') {
			const message = 'JSON Web token is expired, Please try again!!!';
			error = new CustomError(message, 400);
		}

		res.status(err.statusCode).json({
			success: false,
			message: error.message || 'Internal Server Error'
		});
	}
};
