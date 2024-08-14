require('dotenv').config({
  path: './.env'
});
const express = require("express");
const connectDB = require('./config/db');
const passport = require("passport");
const session = require('express-session');

const MongoStore = require('connect-mongo');



/**
 * General Setup
 */
const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));
app.set("view engine", "ejs");
// Connect to Database
connectDB();

/**
 * Session Setup
 */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    stringify: false,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (24 hh/1day * 60 min/1hr * 60 sec/min *1000ms/) 
  }
}));
/**
 * Passport Authentification
 */
require('./config/passport');

// Refresh passport middleware
app.use(passport.initialize());

// Express session middleware
app.use(passport.session());

// Debug Middleware
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});


/**
 * Routes
 */
app.use("/", require("./routes/index"));


/**
 * Error Handler
 */
// To Do

/**
 * Server
 */
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));