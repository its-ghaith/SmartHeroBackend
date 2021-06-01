/**
 * This is a modeling the category collection, how it be will.
 * */

const mongoose = require('mongoose');

// design the category collection on the database
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32,
        unique: true
    },
}, {timestamps: true});

module.exports = mongoose.model("Category", categorySchema);