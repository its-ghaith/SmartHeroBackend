/**
 * This middleware is to check if the passed id valid or not,
 * and to get the category by id
 * */

const mongoose = require('mongoose');
const Category = require('../model/Category');


module.exports  = async (req, res, next) => {

    // get the passed id from request params
    const {categoryId} = req.params;

    // check if the passed id is valid, when not return error
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return res.status(403).json({errors: ['Category not founded.']});

    try {
        // get the category from the database. But it may be, that the category not exist.
        const category = await Category.findById(categoryId);

        // check if the category exist. when not return error.
        if (!category) {
            return res.status(403).json({errors: ['Category not founded.']});
        }

        // if the category exist, then return it and go to next route
        req.category = category
        next();

    } catch (e) {
        console.log(e.message);
        res.status(500).json({errors: ['Server Error']})
    }

}

