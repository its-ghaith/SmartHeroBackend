/**
 * This file serves authentication processes such as registering on the site, logging into the customer’s account,
 * or logging into the seller’s account and logging out.
 * All routes in this file have prefix /api/v1/user
 *
 * */

// Import the router modul from express library
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import the user modul
const User = require("../model/User");

// Validation imports
const {registerValidation, loginValidation} = require('../validation')

// import the middleware
const {authNormalUser} = require('./verifyToken');

// @route POST api/v1/user
// @desc Get the information of user
// @access Private
router.get('/', authNormalUser, async (req, res) => {

    try {
        // get user information by id without the password.
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({errors: ['Server Error']})
    }
});

// @route POST api/v1/user/register
// @desc Register a new user
// @access Public
router.post('/register', async (req, res) => {

    // Validate the req date before we a user add
    const {error} = registerValidation(req.body);
    const errors = [];
    if (error) {
        error.details.forEach(err => errors.push(err.message));
        return res.status(400).json({errors});
    }

    // Checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.status(400).json({errors: ['Email already exist.']});

    // Hashing the password to save it safety in the database.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        // save the user in the database
        const savedUser = await user.save();

        createAssignToken(res, user._id);

    } catch (e) {
        res.status(400).send(e);
    }
});

// @route POST api/v1/user/login
// @desc log in user
// @access Public
router.post('/login', async (req, res) => {

    // Validate the req date before we handle the request
    const {error} = loginValidation(req.body);
    const errors = [];
    if (error) {
        error.details.forEach(err => errors.push(err.message));
        return res.status(400).json({errors});
    }

    // Checking if the email exist
    const user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).json({errors: ['Email or password is wrong.']});

    // Checking if the password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({errors: ['Email or password is wrong.']});

    createAssignToken(res, user._id);


});

const createAssignToken = (res, userID) => {
    // Create and assign a token
    const token = jwt.sign({_id: userID}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json({user_id: userID, token});
}

// export this router to another js file
module.exports = router;