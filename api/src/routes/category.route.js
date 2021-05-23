/**
 * This file to handel the CRUD routes for a Category
 * */

const router = require('express').Router();

// import related moduls
const Category = require('../model/Category');

// import related middleware
const loggend = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');
const categoryById = require('../middleware/categoryById');

// import related validations
const {categoryValidation} = require('../validations/categoryValidation');

// @route POST api/v1/category/add
// @desc add new category
// @access Private Admin
router.post('/add', loggend, isAdmin, async (req, res) => {

    // Validate the req date before we a category add
    const {error} = categoryValidation(req.body);
    const errors = [];
    if (error) {
        error.details.forEach(err => errors.push(err.message));
        return res.status(400).json({errors});
    }

    // get the req body and put them in a object
    const {name} = req.body;

    try {
        // get the category from database if exist
        const category = await Category.findOne({name})

        // check if this category name is exist.
        if (category) return res.status(403).json({errors: ['This category is exist.']});

        const newCategory = new Category({name});

        // save the category in the database
        const savedCategory = await newCategory.save();

        res.status(201).json(savedCategory);


    } catch (e) {
        console.log(e.message);
        res.status(500).json({errors: ['Server Error']})
    }
});

// @route GET api/v1/category/all
// @desc get all categories
// @access Public
router.get('/all', async (req, res) => {
    try {
        // get all categories in the collection
        const data = await Category.find({});

        res.status(200).json(data);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({errors: ['Server Error']})
    }
});

// @route GET api/v1/category/<categoryId>
// @desc get one category by id
// @access Public
router.get('/:categoryId', categoryById, async (req, res) => {
    res.status(200).json(req.category);
});

// @route GET api/v1/category?name=<name>
// @desc get one category by name
// @access Public
router.get('/', async (req, res) => {
    try {
        // get all parameter in URL
        const queryParameter = req.query;
        // get one category by name
        const category = await Category.findOne({name: queryParameter.name});
        if (!category) {
            return res.status(403).json({errors: ['Category not founded.']});
        }
        res.status(200).json(category);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({errors: ['Server Error']})
    }
});

// @route PUT api/v1/category/:categoryId
// @desc update a category
// @access Private Admin
router.put('/:categoryId', loggend, isAdmin, categoryById, async (req, res) => {
    // get the category
    let category = req.category;

    // get the new name from the body of request
    const {name} = req.body;

    // check if the name exist in the body of request
    if (!name) return res.status(403).json({errors: ['The new name of the category is required.']});

    category.name = name.trim();

    try {
        category = await category.save();
        res.status(200).json(category);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({errors: ['Server Error']})
    }

});


// @route DELETE api/v1/category/:categoryId
// @desc delete a category
// @access Private Admin
router.delete('/:categoryId', loggend, isAdmin, categoryById, async (req, res) => {
    // get the category
    let category = req.category;

    try {
        category = await category.remove();
        res.status(200).json({messages: [`The category ${category.name} with the id: ${category._id} deleted successfully.`]});
    } catch (e) {
        console.log(e.message);
        res.status(500).json({errors: ['Server Error']})
    }

});

module.exports = router;
