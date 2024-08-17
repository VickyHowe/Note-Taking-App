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


router.post("/register", async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    const err = new Error('Email, password, and username are required');
    err.status = 400;
    return next(err);
  }

  try {
    const newUser = await User.create({ email, password, username });
    req.logIn(newUser, (err) => {
      if (err) {
        return next(err);
      }
      console.log('User registered successfully');
      res.redirect("/dashboard");
    });
  } catch (err) {
    return next(err);
  }
});


router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password from the response
    res.send(users);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

// Login Route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).render("error", {
        info: {
          title: '401',
          description: 'Invalid User'
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