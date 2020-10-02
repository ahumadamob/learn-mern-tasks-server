const mongoose = require('mongoose');
require('dotenv').config({ path: 'var.env' });

const mongoConnect = async () => {
    try{
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('DB Mongo Conectada');
    } catch (error) {
        console.log(error);
        process.exit(1) //Detener la App
    }
}

module.exports = mongoConnect;