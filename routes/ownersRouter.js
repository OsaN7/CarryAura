const express = require("express");
const router = express.Router();

const ownerModel = require("../models/owner-model");


// Create owner - development only
if (process.env.NODE_ENV === "development") {

    router.post("/create", async (req, res) => {

        console.log("BODY:", req.body);

        let owners = await ownerModel.find();

        if (owners.length > 0) {
            return res
                .status(503)
                .send("Owner already exists");
        }

        let { fullname, email, password } = req.body;

        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password
        });

        res.status(201).send({
            message: "Create a new Owner",
            owner: createdOwner
        });
    });

}


// Admin / Create Products page
router.get("/admin", (req, res) => {

    const success = req.flash("success");
    const error = req.flash("error");

    const loggedin = !!req.cookies.token;

    res.render("createproducts", {
        success,
        error,
        loggedin
    });

});
module.exports = router;