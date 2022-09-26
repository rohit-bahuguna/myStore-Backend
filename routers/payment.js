const express = require('express');
const {
	sendStripeKey,
	sendRazorPayKey,
	captureStripePayment,
	captureRazorPayPayment
} = require('../controllers/paymentController');
const { isLoggedIn } = require('../middlewares/auth');
const paymentRouter = express.Router();

paymentRouter.route('/stripekey').get(isLoggedIn, sendStripeKey);
paymentRouter.route('/razorpaykey').get(isLoggedIn, sendRazorPayKey);

paymentRouter
	.route('/capturestripepayment')
	.post(isLoggedIn, captureStripePayment);

paymentRouter
	.route('/capturerazorpaypayment')
	.post(isLoggedIn, captureRazorPayPayment);

module.exports = paymentRouter;
