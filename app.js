require('dotenv').config({
  path: './.env'
});
const express = require("express");
const connectDB = require('./config/db');
const authRoutes = require("./routes/auth");
const passport = require("passport");
const session = require('express-session');

const app = express();

const PORT = process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

connectDB();




app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

app.use("/", authRoutes);

app.set("view engine", "ejs");

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));