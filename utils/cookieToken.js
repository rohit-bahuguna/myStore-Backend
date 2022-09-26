const cookieToken = (user, response) => {
	const token = user.getJwtToken();
	const options = {
		sameSite: 'none',
		secure: true,
		expires: new Date(
			Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
		),
		httpOnly: true
	};

	response.status(200).cookie('token', token, options).json({
		success: true,
		token,
		user
	});
};

module.exports = cookieToken;
