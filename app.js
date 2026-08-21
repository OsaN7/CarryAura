const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");

require("dotenv").config();


// Routes
const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/index");

// MongoDB connection
const db = require("./config/mongoose-connection");


// =========================
// MIDDLEWARE
// =========================

app.use(cookieParser());
app.use((req, res, next) => {
    res.locals.loggedin = !!req.cookies.token;
    next();
});

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// Session
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET
    })
);


// Flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Static files
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// EJS
app.set("view engine", "ejs");


// =========================
// ROUTES
// =========================

app.use("/", indexRouter);

app.use("/owners", ownersRouter);

app.use("/users", usersRouter);

app.use("/products", productsRouter);


// =========================
// SERVER
// =========================

app.listen(3000, () => {

    console.log("Server running on http://localhost:3000");

});