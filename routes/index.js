const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Notes = require("../models/notes");
const isAuth = require("../middlewares/authorizedUser").isAuth;

/**
 * @swagger
 * /:
 *   get:
 *     summary: Load Homepage
 *     description: Renders the homepage
 *     responses:
 *       200:
 *         description: Homepage rendered successfully
 */
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


/**
 * @swagger
 * /login:
 *   get:
 *     summary: Load Login Page
 *     description: Renders the login page
 *     responses:
 *       200:
 *         description: Login page rendered successfully
 */
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

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Load Register Page
 *     description: Renders the register page
 *     responses:
 *       200:
 *         description: Register page rendered successfully
 */
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

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout User
 *     description: Logs out the user
 *     responses:
 *       302:
 *         description: Redirect to homepage
 */
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
