const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

const isAuth = require("../middlewares/authorizedUser").isAuth;


// Google Login Route
router.get(
"/auth/google",
passport.authenticate("google", { scope: ["email", "profile"] })
);

// Retrieve user data
router.get(
"/google/callback",
passport.authenticate("google", {
failureRedirect: "/login",
successRedirect: "/dashboard",
}));


// Register route
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const newUser = await User.create({ email, password, username });
    req.logIn(newUser, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/dashboard");
    });
  } catch (err) {
    res.status(500).json({
      message: "Could not create the user",
      error: err,
    });
  }
});

// Login Route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).render("401", {
        info: {
          title: '401',
          description: 'A Note Taking App'
        }
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/dashboard");
    });
  })(req, res, next);
});




module.exports = router;