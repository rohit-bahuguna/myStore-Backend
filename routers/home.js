const express = require('express');
const homeRouter = express.Router();
const { home, signUpForm } = require('../controllers/homeController');

homeRouter.route('/').get(home);
homeRouter.route('/signupform').get(signUpForm);

module.exports = homeRouter;
