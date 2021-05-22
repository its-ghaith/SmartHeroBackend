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
        max: 26
    },
    last_name: {
        type: String,
        required: true,
        min: 2,
        max: 26
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
        max: 1024
    },
    avatar: { // User image
        type: String,
    },
    role: { // Role of user it will be (0 for normal or 1 for seller)
        type: Number,
        default: 0
    },
    history: { // order history
        type: Array,
        default: []
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);