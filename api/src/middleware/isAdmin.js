/**
 * This middleware to check if the user admin role has
 * */
const User = require('../model/User');
module.exports = async (req, res, next) => {
    try {

        // get the user information by id
        const user = await User.findById({_id: req.user._id})

        // if in the array of user no role named admin then return error
        if (!user.roles.includes('Admin')) return res.status(403).json({errors: ['Admin resources access denied']});

        // else next
        next();

    } catch (e) {
        console.log(e);
        res.status(403).json({errors: ['Server error']});
    }
}