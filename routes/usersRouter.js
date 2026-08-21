const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controller/authController");


// USERS HOME

router.get("/", function (req, res) {

    res.send("Users is working this route");

});


// REGISTER PAGE

router.get("/register", function (req, res) {

    res.render("register");

});


// REGISTER USER

router.post("/register", registerUser);


// LOGIN PAGE

router.get("/login", function (req, res) {

    let error = req.flash("error");

    res.render("login", {
        error: error
    });

});


// LOGIN USER

router.post("/login", loginUser);


// LOGOUT

router.get("/logout", function (req, res) {

    res.clearCookie("token");

    res.redirect("/");

});


module.exports = router;