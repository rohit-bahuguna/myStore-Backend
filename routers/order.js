const express = require('express');
const orderRouter = express.Router();
const {
	createOrder,
	getOneOrder,
	getUserOrder,
	adminGetAllOrders,
	adminUpdateOrderStatus,
	adminDeleteOrder
} = require('../controllers/orderController');

const { isLoggedIn, customRole } = require('../middlewares/auth');

orderRouter.route('/order/create').post(isLoggedIn, createOrder);

orderRouter.route('/order/getmyorder').get(isLoggedIn, getUserOrder);

orderRouter.route('/order/:id').get(isLoggedIn, getOneOrder);

orderRouter
	.route('/admin/getallorders')
	.get(isLoggedIn, customRole('admin'), adminGetAllOrders);

orderRouter
	.route('/admin/update/orderstatus/:id')
	.put(isLoggedIn, customRole('admin'), adminUpdateOrderStatus);

orderRouter
	.route('/admin/deleteorder/:id')
	.delete(isLoggedIn, customRole('admin'), adminDeleteOrder);

module.exports = orderRouter;
