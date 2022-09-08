const UserModel = require('../models/userModel');
const BigPromise = require('../middlewares/bigPromise')
const customError = require('../utils/customError');
const userModel = require('../models/userModel');
const cookieToken = require('../utils/cookieToken');




exports.signUp = BigPromise(async (req, res, next) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new customError('please provide all fileds', 400));
    };
    const user = await userModel.create({
        name,
        email,
        password
    })
    cookieToken(user, res)

})