const BigPromise = require('../middlewares/bigPromise');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const sendStripeKey = BigPromise(async (req, res, next) => {
	res.status(200).json({ stripeKey: process.env.STRIPE_API_KEY });
});

const captureStripePayment = BigPromise(async (req, res, next) => {
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
