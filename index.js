const app = require('./app');

app.listen(process.env.PORT, () => {
    console.log(`server is runing at port ${process.env.PORT}`);
})