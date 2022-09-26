const BigPromise = require('../middlewares/bigPromise');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const razorpay = require('razorpay');

exports.sendStripeKey = BigPromise(async (req, res, next) => {
	res.status(200).json({ stripeKey: process.env.STRIPE_API_KEY });
});

exports.captureStripePayment = BigPromise(async (req, res, next) => {
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: 'inr',
					unit_amount: req.body.amount
				}
			}
		],
		mode: 'payment'
	});
	console.log(session);
	res.status(200).json({
		success: true,
		session
	});
});

exports.sendRazorPayKey = BigPromise(async (req, res, next) => {
	res.status(200).json({ stripeKey: process.env.RAZORPAY_API_KEY });
});

exports.captureRazorPayPayment = BigPromise(async (req, res, next) => {
	const amount = req.body.amount;

	var instance = new razorpay({
		key_id: process.env.RAZORPAY_API_KEY,
		key_secret: process.env.RAZORPAY_SECRET_KEY
	});

	const myOrder = await instance.orders.create({
		amount: amount * 100,
		currency: 'INR',
		receipt: 'receipt#1'
	});

	res.status(200).json({
		success: true,
		amount,
		order: myOrder
	});
	console.log(myOrder);
});
