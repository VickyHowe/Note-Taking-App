const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Notes = require("../models/notes");
const isAuth = require("../middlewares/authorizedUser").isAuth;

// Load Homepage
router.get("/", (req, res) => {
  res.render("index", {
    layout: "../views/layouts/home",
    info: {
      title: "Note Taking App",
      description: "A Note Taking App",
    },
  });
});

// Load Login Page
router.get("/login", (req, res) => {
  res.render("login", {
    info: {
      title: "Login",
      description: "Login - Note Taking App ",
    },
  });
});

// register user page
router.get("/register", (req, res) => {
  res.render("register", {
    info: {
      title: "Sign-up",
      description: "Sign-up - Note Taking App ",
    },
  });
});


// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


  module.exports = router;
