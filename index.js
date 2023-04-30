const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const connection = require('./src/Connections/mongo_connection');
const secret = require('./src/Config/secret');

const userRouter = require('./src/Routes/UserRoute');
const gameRouter = require('./src/Routes/GameRoute');

// ----------Database Connection------------- //
(async () => await connection())();

// --------------Middleware--------------- //
app.use(cors({
    origin: 'http://localhost:4200', // Access-Control-Allow-Origin: http://localhost:4200
    credentials: true,// Access-Control-Allow-Credentials: true
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // If needed Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
    maxAge: 21600 // 3 hours Access-Control-Max-Age: 21600 (seconds)
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(compression());

// --------------Routes--------------- //
app.use('/api/user', userRouter);
app.use('/api/game', gameRouter);


// --------------Connection Port--------------- //
const port = secret.PORT;

// --------------Server--------------- //
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
})
