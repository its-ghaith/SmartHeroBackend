/**
 * This middleware is to check if the passed id valid or not,
 * and to get the product by id
 * */

const mongoose = require('mongoose');
const Product = require('../model/Product');

module.exports = async (req, res, next) => {

    // get the passed id from request params
    const {productId} = req.params;

    // check if the passed id is valid, when not return error
    if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(403).json({errors: ['Product not founded.']});

    try {
        // get the category from the database. But it may be, that the category not exist.
        const product = await Product.findById(productId).populate('categories');

        // check if the product exist. when not return error.
        if (!product) {
            return res.status(403).json({errors: ['product not founded.']});
        }

        // if the product exist, then return it and go to next route
        req.product = product
        next();

    } catch (e) {
        console.log(e.message);
        res.status(500).json({errors: ['Server Error']})
    }

}