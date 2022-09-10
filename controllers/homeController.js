const BigPronise = require('../middlewares/bigPromise');

exports.home = BigPronise((req, res) => {
	res.status(200).json({
		success: true,
		greeting: 'Hello from API'
	});
});

exports.signUpForm = BigPronise((req, res) => {
	res.render('postForm');
});
