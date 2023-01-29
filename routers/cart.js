const express = require('express');
const {
	deleteFromCart,
	getOneCart,
	getAllCart,
	addToCart,
	updateCart
} = require('../controllers/cartControllers');
const cartRouter = express.Router();

const { isLoggedIn } = require('../middlewares/auth');

cartRouter.route('/cart/addtocart').post(isLoggedIn, addToCart);
cartRouter.route('/cart/getallcart').get(isLoggedIn, getAllCart);
cartRouter.route('/cart/deletefromcart/:id').delete(isLoggedIn, deleteFromCart);
cartRouter.route('/cart/updatecart:/id').put(isLoggedIn, updateCart);

module.exports = cartRouter;
