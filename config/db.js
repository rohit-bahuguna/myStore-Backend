const mongoose = require('mongoose');

const connnectWithDb = () => {
    mongoose
        .connect(process.env.MONGO_URL , () =>{
       console.log('db got connected') })
        .then(console.log('db is connecting'))
        .catch(error => console.log(error));
};

module.exports = connnectWithDb;
