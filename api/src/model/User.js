/**
 * This is a modeling the user collection, how it be will.
 *
 * */

const mongoose = require('mongoose');

// design the user collection on the database
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        min: 2,
        maxlength: 26
    },
    last_name: {
        type: String,
        required: true,
        min: 2,
        maxlength: 26
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: "Email address is required",
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    },
    password: {
        type: String,
        required: true,
        min: 6,
        maxlength: 1024
    },
    avatar: { // User image
        type: String,
    },
    roles: {
        type: Array,
        default: ['Customer']
    },
    history: { // order history
        type: Array,
        default: []
    },
},{timestamps: true});

module.exports = mongoose.model("User", userSchema);