const express = require('express');
const homeRouter = express.Router();
const { home } = require('../controllers/homeController')

homeRouter.route('/').get(home)



module.exports = homeRouter;