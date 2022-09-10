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
	updateUserDetails
} = require('../controllers/userController');

const isLoggedIn = require('../middlewares/auth');

userRouter.route('/signup').post(signUp);
userRouter.route('/login').post(logIn);
userRouter.route('/logout').get(logOut);
userRouter.route('/forgotpassword').post(forgotPassword);
userRouter.route('/password/reset/:token').post(restPassword);
userRouter.route('/userdeshboard').get(isLoggedIn, getLoggedInUserDetails);
userRouter.route('/password/update').post(isLoggedIn, updatePassword);
userRouter.route('/userdashboard/update').put(isLoggedIn, updateUserDetails);
module.exports = userRouter;
