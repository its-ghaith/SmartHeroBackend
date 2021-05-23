/**
 * This file serves to verify the information passed through the request body before processing it in the database.
 *
 * */

//Validation
const Joi = require('@hapi/joi');

// Category Validation
const categoryValidation = (data) => {
    const schema = {
        name: Joi.string().min(2).max(32).required().trim(),
    }
    return Joi.validate(data, schema, {abortEarly: false});
};




// Export all validation functions to this file for them to be usable
module.exports.categoryValidation = categoryValidation;

