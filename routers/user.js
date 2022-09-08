const express = require('express');
const userRouter = express.Router();

const { signUp } = require('../controllers/userController')

userRouter.route('/signup').post(signUp);


module.exports = userRouter;