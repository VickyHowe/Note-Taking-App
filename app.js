// Install Libraries
const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require("express-ejs-layouts");
const { LoggedIn } = require('./middlewares/authorizedUser');

const config = require('dotenv').config();

const passport = require("passport");

const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT;

// Initialize Passport Library
app.use(passport.initialize());

app.use(express.json());
app.use(bodyParser.json());


// Connect to Database
connectDB();

// Static Files
app.use(express.static('public'));

// Template Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/googleAuth'));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/register'));
app.use('/', require('./routes/dashboard'));
app.use('/', require('./routes/index'));




app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));


