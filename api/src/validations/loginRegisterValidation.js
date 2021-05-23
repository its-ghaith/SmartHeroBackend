/**
 * This file serves to verify the information passed through the request body before processing it in the database.
 *
 * */

//Validation
const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = (data) => {
    const schema = {
        first_name: Joi.string().min(2).max(26).required(),
        last_name: Joi.string().min(2).max(26).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
        roles: Joi.array().items(Joi.string())
    }
    return Joi.validate(data, schema, {abortEarly: false});
};

// Login Validation
const loginValidation = (data) => {
    const schema = {
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required()
    }
    return Joi.validate(data, schema, {abortEarly: false});
};


// Export all validation functions to this file for them to be usable
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
