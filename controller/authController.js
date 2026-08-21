const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");


// =========================
// REGISTER USER
// =========================

module.exports.registerUser = async (req, res) => {

    try {

        const { email, password, fullname } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            req.flash("error", "User already exists");
            return res.redirect("/users/register");
        }

        // Generate salt
        bcrypt.genSalt(10, (err, salt) => {

            if (err) {
                return res.send(err.message);
            }

            // Hash password
            bcrypt.hash(password, salt, async (err, hash) => {

                if (err) {
                    return res.send(err.message);
                }

                // Create user
                const newUser = await userModel.create({
                    password: hash,
                    email,
                    fullname
                });

                // Generate JWT
                const token = generateToken(newUser);

                // Store token in cookie
                res.cookie("token", token);

                // Redirect to shop
                res.redirect("/shop");

            });

        });

    } catch (err) {

        console.log(err);
        res.send(err.message);

    }
};


// =========================
// LOGIN USER
// =========================
module.exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/users/login");
        }

        bcrypt.compare(password, user.password, function (err, result) {

            if (err) {
                req.flash("error", "Something went wrong");
                return res.redirect("/users/login");
            }

            if (!result) {
                req.flash("error", "Invalid Password");
                return res.redirect("/users/login");
            }

            const token = generateToken(user);

            res.cookie("token", token);

            // Successful login → shop
            return res.redirect("/shop");

        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong");

        return res.redirect("/users/login");
    }
};


// =========================
// LOGOUT USER
// =========================

module.exports.logout = (req, res) => {

    // Delete token cookie
    res.clearCookie("token");

    // Go back to login
    res.redirect("/users/login");
};