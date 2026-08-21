const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {

    // Check if user has a login cookie
    if (!req.cookies.token) {
        req.flash("error", "You need to login first");
        return res.redirect("/users/login");
    }

    try {

        // Verify token
        const decoded = jwt.verify(
            req.cookies.token,
            process.env.JWT_KEY
        );

        // Find user in database
        const user = await userModel
            .findOne({ email: decoded.email })
            .select("-password");

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/users/login");
        }

        // Store user information in req
        req.user = user;

        // Continue to /shop
        next();

    } catch (err) {

        console.log(err);

        req.flash("error", "You need to login first");
        return res.redirect("/users/login");
    }
};