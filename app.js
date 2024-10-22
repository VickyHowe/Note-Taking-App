require('dotenv').config({
  path: './.env'
});
const express = require("express");
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const passport = require("passport");
const session = require('express-session');

const MongoStore = require('connect-mongo@3');
const errorHandler = require('./middlewares/errorHandler');

/**
 * General Setup
 */
const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(express.static('public'));

app.use(expressLayouts);
app.set('layout', './layouts/main')
app.set("view engine", "ejs");

const serveSwagger = require('./swagger');

/**
 * Connect to Database
 */
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
    stringify: false, //may not need this
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

/**
 * Dubug Middleware
 */

// app.use((req, res, next) => {
//   console.log(req.session);
//   console.log(req.user);
//   next();
// });

/**
 * Call Swagger
 */
serveSwagger(app);

/**
 * Routes
 */
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/notes"));


/**
 * Error Handler
 */

// Error Handler for all Errors Not 404
app.use(errorHandler);


/**
 * @swagger
 * /{path}:
 *   get:
 *     summary: Get the 404 error page
 *     description: Returns the 404 error page for any unmatched route
 *     responses:
 *       404:
 *         description: The 404 error page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
app.get('*', (req, res) => {
  res.status(404).render('404', {
    layout: '../views/layouts/home',
    info: {
      title: '404',
      description: 'Not Found'
    }
  });
});

  
/**
 * Server
 */
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
