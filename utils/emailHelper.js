const nodemailer = require('nodemailer');

const mailHelper = async options => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS
		}
	});
	console.log(options.url);
	const message = {
		from: 'rohitbahuguna@gmail.com',
		to: options.email,
		subject: options.subject,
		text: options.message,
		html: `<a href=${options.url}>click here to reset password</a>`
	};
	// send mail with defined transport object
	await transporter.sendMail(message);
};

module.exports = mailHelper;
