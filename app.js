// require / import packages here
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const fs = require('fs');
const path = require('path');
const errorMiddleware = require('./middlewares/error');
// created app here
const app = express();

// setting template engine

app.set('view engine', 'ejs');

// importing  all routers here
const home = require('./routers/home');
const user = require('./routers/user');
const product = require('./routers/product');
const payment = require('./routers/payment');
const order = require('./routers/order');

// using Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//using Third - party middleware
app.use(
	cors({
		origin: process.env.ORIGIN,
		credentials: true
	})
);
if (process.env.NODE_ENV == 'PRODUCTION') {
	const accessLogStream = fs.createWriteStream(
		path.join(__dirname, 'access.log'),
		{ flags: 'a' }
	);
	app.use(
		morgan('  :method :url :response-time  [:date[web] ', {
			stream: accessLogStream
		})
	);
} else {
	app.use(morgan('tiny'));
}
app.use(cookieParser());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/'
	})
);

//using router middleware here
app.use('/api/v1', home);
app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', payment);
app.use('/api/v1', order);

// swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//error middleware

app.use(errorMiddleware);

// expored to index.js
module.exports = app;
