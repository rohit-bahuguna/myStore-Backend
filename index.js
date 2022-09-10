const app = require('./app');
const connnectWithDb = require('./config/db');
const cloudinary = require('cloudinary');

// connection with mongonDb
connnectWithDb();

// cloudinary  config

cloudinary.config({
	cloud_name: process.env.CLOUDUNARY_NAME,
	api_key: process.env.CLOUDUNARY_API_KEY,
	api_secret: process.env.CLLOUDINARY_API_SECRET
});

app.listen(process.env.PORT, () => {
	console.log(`server is runing at port ${process.env.PORT}`);
});
