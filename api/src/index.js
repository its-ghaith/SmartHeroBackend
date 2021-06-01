// Import the requirements libraries/
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');


// Import all routes
const authRoute = require('./routes/auth.route');
const categoryRoute = require('./routes/category.route');
const productRoute = require('./routes/product.route');


// define the objects to the app
const app = express();

app.use("/public", express.static(path.join(__dirname, 'public')));

// allow the app to use json
app.use(express.json());

// use all routes
app.use('/api/v1/user', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);

// init the env file
dotenv.config();

// connect to db
const dbOption = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

mongoose.connect(
    process.env.DB_URL,
    dbOption,
    () => console.log('Connected to db')
);

// Page not founded
app.use((req, res) => {
    res.status(404).json({
        msg: 'Page not founded'
    })
});


// Let the app listen to port
const port = process.env.PORT
let server = app.listen(port, '0.0.0.0', () => console.log(`Server up and running and listening on port ${port}.`));
