const express = require("express");
const router = express.Router();

const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const isLoggedIn = require("../middlewares/isLoggedIn");


// HOME
router.get("/", function (req, res) {

    let error = req.flash("error");

    res.render("index", {
        error: error,
        loggedin: false
    });

});

//ACCOUNTT 
router.get("/account", isLoggedIn, async function (req, res) {

    try {

        const user = await userModel
            .findOne({
                email: req.user.email
            })
            .select("-password")
            .populate("cart");

        res.render("account", {
            user: user,
            loggedin: true
        });

    } catch (err) {

        console.log(err);

        res.status(500).send("Something went wrong");

    }

});


// SHOP
router.get("/shop", isLoggedIn, async function(req, res) {

    try {

        let products = await productModel.find();

        res.render("shop", {
            products: products,
            loggedin: true
        });

    } catch (err) {

        console.log(err);

        res.status(500).send("Something went wrong");

    }

});

//Register
router.get("/register", function (req, res) {

    const error = req.flash("error");

    res.render("register", {
        error: error
    });

});

// CART
router.get("/cart", isLoggedIn, async function (req, res) {

    try {

        let user = await userModel
            .findOne({
                email: req.user.email
            })
            .populate("cart");

        res.render("cart", {
            user: user,
            loggedin: true
        });

    } catch (err) {

        console.log(err);
        res.status(500).send("Something went wrong");

    }

});


// ADD TO CART
router.post("/cart/add/:id", isLoggedIn, async function (req, res) {

    try {

        let user = await userModel.findOne({
            email: req.user.email
        });

        user.cart.push(req.params.id);

        await user.save();

        res.redirect("/cart");

    } catch (err) {

        console.log(err);
        res.status(500).send("Something went wrong");

    }

});


// REMOVE ONE ITEM FROM CART
router.post("/cart/remove/:id", isLoggedIn, async function (req, res) {

    try {

        let user = await userModel.findOne({
            email: req.user.email
        });

        let index = user.cart.findIndex(function (item) {

            return item.toString() === req.params.id;

        });

        if (index !== -1) {

            user.cart.splice(index, 1);

        }

        await user.save();

        res.redirect("/cart");

    } catch (err) {

        console.log(err);
        res.status(500).send("Something went wrong");

    }

});


// LOGOUT
router.get("/logout", function (req, res) {

    res.clearCookie("token");

    res.redirect("/");

});


module.exports = router;