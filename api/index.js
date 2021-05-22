// Import the requirements libraries/
const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Import all routes
const authRoute = require('./routes/auth');

// define the objects to the app
const app = express();
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

// Middleware
app.use(express.json());

// Route Middleware
app.use('/api/v1/user', authRoute);

// Page not founded
app.use((req,res) =>{
   res.status(404).json({
       msg:'Page not founded'
   })
});

// Let the app listen to port
const port = process.env.PORT
app.listen(port, () => console.log(`Server up and running and listening on port ${port}.`));