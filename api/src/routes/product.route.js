/**
 * This file to handel the CRUD routes for a Product
 * */

const router = require('express').Router();
const bcrypt = require('crypto');
const path = require('path')
const formidable = require('formidable');
const fs = require('fs')


// import related moduls
const Product = require('../model/Product');

// import related middleware
const loggend = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');
const productById = require('../middleware/productById');

// import related validations

let photosArray = [];
let photosPathArray = [];

// @route POST api/v1/product/add
// @desc add new category
// @access Private Admin
router.post('/add', loggend, isAdmin, async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;

    form.parse(req, async (err, fields, files) => {
        photosPathArray = [];
        photosArray = [];
        // check for photo

        // // check if in upload process some error are happened and return an error message.
        if (err) return res.status(400).json({errors: ['Image could not be uploaded.']});

        // check if the photo exist
        if (!files.photos) return res.status(400).json({errors: ['Image is required.']});

        // check for another fields
        const {name, description, price, categories, quantity, shipping} = fields;
        if (!name || !description || !price || !categories || !quantity || !shipping) {
            return res.status(400).json({errors: ['name, description, price, category, quantity, shipping fileds are required']});
        }

        // check if this product has more that COUNT_PHOTO_PRODUCT in env file
        if (process.env.COUNT_PHOTO_PRODUCT < photosArray.length)
            return res.status(400).json({errors: [`For one product is allowed only ${process.env.COUNT_PHOTO_PRODUCT} photos`]});

        // create a new product object
        let product = new Product(fields);

        // put the paths of photos in the product object
        product.photos = photosPathArray;

        // store the photos in the public folder
        photosArray.forEach((photo) => {
            fs.writeFile(photo.newPath, photo.rawData, function (err) {
                if (err) {
                    console.log(e.message);
                    res.status(500).json({errors: ['Server Error']});
                }
            });
        });

        // save the product object in the database
        try {
            await product.save();
            photosPathArray = [];
            photosArray = [];
            res.json(product);
        } catch (e) {
            console.log(e.message);
            res.status(500).json({errors: ['Server Error']})
        }
    });

    // handle the photo one by one. And push it to array. We will save the photos in this array after check if the length
    // of this array less that the COUNT_PHOTO_PRODUCT in env file
    form.on('file', (name, file) => {

        // check the type of photo. We accept only jpeg, jpg, png. and the size of photos
        const photoType = file.type;
        if (photoType !== 'image/jpeg' && photoType !== 'image/jpg' && photoType !== 'image/png') {
            return res.status(400).json({errors: ['Type of image is not allowed. We accept only jpeg, jpg, png']});
        }

        // check the size of the photos
        if (file.size > process.env.PHOTO_SIZE * 1000000) {
            return res.status(400).json({errors: [`Image should be less than ${process.env.PHOTO_SIZE} MB in size`]});
        }

        const oldPath = file.path;
        const hash = bcrypt.createHash('md5').update(Date.now().toString()).digest('hex');
        const newPath = path.join(__dirname + '/../public/uploads/products', hash + path.extname(oldPath));
        const rawData = fs.readFileSync(oldPath);
        photosPathArray.push(`${process.env.HOST}:${process.env.PORT}/public/uploads/products/${hash + path.extname(oldPath)}`);
        photosArray.push({
            newPath: newPath,
            rawData: rawData
        });
    });
});

// @route GET api/v1/product/<productId>
// @desc Get one product by id
// @access Public
router.get('/:productId', productById, async (req, res) => {
    req.product.photo = undefined;
    return res.status(200).json(req.product);
});


module.exports = router;
