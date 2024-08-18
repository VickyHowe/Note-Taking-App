const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Notes = require("../models/notes");
const isAuth = require("../middlewares/authorizedUser").isAuth;

// Load Homepage
router.get("/", (req, res) => {
  try {
  res.render("index", {
    layout: "../views/layouts/home",
    info: {
      title: "Note Taking App",
      description: "A Note Taking App",
    },
  });
  } catch (err) {
    next(err);
  }
});


// Load Login Page
router.get("/login", (req, res) => {
  try {
  res.render("login", {
    info: {
      title: "Login",
      description: "Login - Note Taking App ",
    },
  });
  } catch (err) {
    next(err);
  }
});

// register user page
router.get("/register", (req, res) => {
  try {
  res.render("register", {
    info: {
      title: "Sign-up",
      description: "Sign-up - Note Taking App ",
    },
  });
  } catch (err) {
    next(err);
  }
});

// Logout route
router.get("/logout", (req, res) => {
  try {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
  } catch(err) {
    return next (err);
  }
});


  module.exports = router;
