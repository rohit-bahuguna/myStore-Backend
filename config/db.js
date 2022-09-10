const mongoose = require('mongoose');

const connnectWithDb = () => {
    mongoose
        .connect(process.env.MONGO_URL)
        .then(console.log('db got connected'))
        .catch(error => console.log(error));
};

module.exports = connnectWithDb;
