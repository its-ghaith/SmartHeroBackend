/**
 * This is a modeling the product collection, how it be will.
 * */

const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


// design the product collection on the database
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 32,
    },
    categories: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    photos: [
        {
            type: String,
        }
    ],
    shipping: {
        required: false,
        type: Boolean
    }

}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);