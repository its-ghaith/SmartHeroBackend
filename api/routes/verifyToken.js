/**
 * This file be ues to verify the token, when the user want to login or to perform a some processes, which require
 * authentication.
 * */

const jwt = require('jsonwebtoken');

// This function be use as a middleware of a route to check if the normal user loggen in.
const authNormalUser = (req, res, next) => {
    const token = req.header('auth-token');

    // check if the token parameter is in the header of request.
    if (!token) return res.status(401).json({errors: ['Access denied.']});

    // verified the token
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (e) {
        res.status(401).json({errors: ['Invalid Token.']});
    }
}

// export all functions of the verify.
module.exports.authNormalUser = authNormalUser;
