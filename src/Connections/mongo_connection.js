const mongoose = require('mongoose');
require('dotenv').config();

// ! Change the URL when you are deploying your application

const LOCAL_URL = 'mongodb://127.0.0.1:27017/GuessingGame';

const PRODUCTION_URL = process.env.DATABASE_URL;

module.exports = async function connection() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(`${LOCAL_URL}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('📦 Database Connected');
        }).catch(err => {
            console.log('Database Connection Error: ', err.message);
        })
    } catch (err) {
        console.log(err.message);
    }
}