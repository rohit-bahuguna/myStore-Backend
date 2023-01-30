const cartModal = require('../models/cartModel');
const productModel = require('../models/productModel');
const { getOneProduct } = require('../controllers/productController');
const BigPromise = require('../middlewares/bigPromise');
const customError = require('../utils/customError');

exports.addToCart = BigPromise(async (req, res, next) => {
	let usersCart = await cartModal.findOne({ user: req.user._id });
	const product = await productModel.findById(req.body.product);
	if (!usersCart) {
		usersCart = new cartModal({ cartItem: product, user: req.user._id });
	} else {
		usersCart.cartItem.push(product);
	}

	const carts = await usersCart.save();

	res.status(200).json({ success: true, carts });
});

exports.getAllCart = BigPromise(async (req, res) => {
	const id = req.user._id;
	const carts = await cartModal.findOne({ user: id });
	res.status(200).json({ success: true, carts });
});

exports.deleteFromCart = BigPromise(async (req, res) => {
	const userId = req.user._id;
	const productId = req.params.id;

	const item = await cartModal.findOne({ user: userId });

	updatedItems = item.cartItem.filter(value => {
		console.log(value._id, productId);
		return value._id == productId;
	});

	console.log(updatedItems);
	const p = await cartModal.findOneAndUpdate(
		{ user: userId },
		{
			cartItem: updatedItems
		},
		{ new: true }
	);
	res.status(200).json({ success: true, p });
});

exports.updateCart = async (req, res) => {
	const id = req.params.id;

	try {
		const updatedItem = await cartModal.findByIdAndUpdate(
			id,
			{ product: req.body },
			{
				new: true
			}
		);
		res.status(200).json(updatedItem);
	} catch (error) {
		console.log(error);
		res.status(400).json({ massage: error.massage });
	}
};
