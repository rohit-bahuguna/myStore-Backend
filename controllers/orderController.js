const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const BigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const { propfind } = require('../routers/order');

exports.createOrder = BigPromise(async (req, res, next) => {
	const {
		shippingInfo,
		orderItems,
		paymentInfo,
		taxAmount,
		ShippingAmount,
		TotalAmount
	} = req.body;

	const order = await orderModel.create({
		shippingInfo,
		orderItems,
		paymentInfo,
		taxAmount,
		ShippingAmount,
		TotalAmount,
		user: req.user._id
	});

	res.status(200).json({
		success: true,
		order
	});
});

exports.getOneOrder = BigPromise(async (req, res, next) => {
	const { id } = req.params;
	const order = await orderModel.findById(id).populate('user', 'name email');
	if (!order) {
		return next(new CustomError('please check order id', 401));
	}

	res.status(200).json({
		success: true,
		order
	});
});

exports.getUserOrder = BigPromise(async (req, res, next) => {
	const order = await orderModel.find({ user: req.user._id });

	res.status(200).json({
		success: true,
		order
	});
});

exports.adminGetAllOrders = BigPromise(async (req, res, next) => {
	const orders = await orderModel.find();
	res.status(200).json({
		success: true,
		orders
	});
});

exports.adminUpdateOrderStatus = BigPromise(async (req, res, next) => {
	const { id } = req.params;
	const { orderStatus } = req.body;
	const order = await orderModel.findById(id);

	if (!order) {
		return next(new CustomError('order not found', 404));
	}
	if (order.orderStatus === 'Delivered') {
		return next(new CustomError('order is already delivered'), 401);
	}
	order.orderStatus = orderStatus;

	order.orderItems.forEach(async prod => {
		await updateProductStock(prod.product, prod.quantity);
	});

	const updatedOrder = await order.save();

	res.status(200).json({
		success: true,
		updatedOrder
	});
});

exports.adminDeleteOrder = BigPromise(async (req, res, next) => {
	const { id } = req.params;
	const order = await orderModel.findById(id);
	const deleted = await order.remove();
	res.status(200).json({
		success: true,
		deleted
	});
});

async function updateProductStock(productId, quantity) {
	const product = await productModel.findById(productId);

	product.stock = product.stock - quantity;
	await product.save({ validateBeforeSave: false });
}
