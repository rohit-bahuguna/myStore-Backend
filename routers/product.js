const express = require('express');
const productRouter = express.Router();
const {
	addProducts,
	getAllProducts,
	adminGetAllProduct,
	getOneProduct,
	adminUpdateProduct,
	adminDeleteProduct,
	addReview,
	deleteAReview,
	getOnlyReviewsForOneProduct
} = require('../controllers/productController');

const { isLoggedIn, customRole } = require('../middlewares/auth');

// user routes
productRouter.route('/product').get(getAllProducts);
productRouter.route('/product/:id').get(getOneProduct);

// review routes
productRouter.route('/review').put(isLoggedIn, addReview);
productRouter.route('/review').delete(isLoggedIn, deleteAReview);
productRouter.route('/review').get(isLoggedIn, getOnlyReviewsForOneProduct);

// admin only routes
productRouter
	.route('/admin/product/add')
	.post(isLoggedIn, customRole('admin'), addProducts);

productRouter
	.route('/admin/product')
	.get(isLoggedIn, customRole('admin'), adminGetAllProduct);

productRouter
	.route('/admin/product/:id')
	.put(isLoggedIn, customRole('admin'), adminUpdateProduct)
	.delete(isLoggedIn, customRole('admin'), adminDeleteProduct);

module.exports = productRouter;
