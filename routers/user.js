const express = require('express');
const userRouter = express.Router();

const {
	signUp,
	logIn,
	logOut,
	forgotPassword,
	restPassword,
	getLoggedInUserDetails,
	updatePassword,
	updateUserDetails,
	adminAllUser,
	managerAllUser,
	adminGetOneUser,
	adminUpdateOneUserDetails,
	adminDeleteOneUser,
	updateUserShippingInfo
} = require('../controllers/userController');

const { isLoggedIn, customRole } = require('../middlewares/auth');

userRouter.route('/signup').post(signUp);
userRouter.route('/login').post(logIn);
userRouter.route('/logout').get(logOut);
userRouter.route('/forgotpassword').post(forgotPassword);
userRouter.route('/password/reset/:token').post(restPassword);
userRouter.route('/userdeshboard').get(isLoggedIn, getLoggedInUserDetails);
userRouter.route('/password/update').post(isLoggedIn, updatePassword);
userRouter.route('/userdashboard/update').put(isLoggedIn, updateUserDetails);
userRouter
	.route('/userdashboard/updateshippinginfo')
	.put(isLoggedIn, updateUserShippingInfo);
// admin route
userRouter
	.route('/admin/users')
	.get(isLoggedIn, customRole('admin'), adminAllUser);

userRouter
	.route('/admin/user/:id')
	.get(isLoggedIn, customRole('admin'), adminGetOneUser)
	.put(isLoggedIn, customRole('admin'), adminUpdateOneUserDetails)
	.delete(isLoggedIn, customRole('admin'), adminDeleteOneUser);

// manager route
userRouter
	.route('/manager/users')
	.get(isLoggedIn, customRole('manager'), managerAllUser);

module.exports = userRouter;
