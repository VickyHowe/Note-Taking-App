const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


const flash = require('connect-flash');

const isAuth = require("../middlewares/authorizedUser").isAuth;

router.use(flash());


/**
 * Get Routes
 */
// Load Homepage
router.get("/", (req, res) => {
    res.render("index", { message: req.flash("error") });
});

// Load Login Page
router.get("/login", (req, res) => {
  res.render("login", { message: req.flash("error") });
});


// Google Login Route
router.get(
"/auth/google",
passport.authenticate("google", { scope: ["email", "profile"] })
);

// Retrieve user data
router.get(
"/google/callback",
passport.authenticate("google", {
failureRedirect: "/login-failure",
successRedirect: "/dashboard",
}),
async (req, res) => {
const user = req.user;
const accessToken = jwt.sign({ id: user._id }, process.env.SECRET, {
  expiresIn: "1h",
});
res.redirect("/dashboard");
}
);


// Load Dashboard
router.get("/dashboard", isAuth, (req, res, next) => {
    res.render("dashboard", { user: req.user });
  });

// register user page
router.get("/register", (req, res) => {
  res.render("register", { message: req.flash("error") });
  });



// Logout route
router.get('/logout', (req, res) => {
req.logout((err) => {
  if (err) {
    return next(err);
  }
  res.redirect('/');
});
});

// // Route if something goes wrong
// router.get("/login-failure", (req, res) => {
// res.send("Something went wrong...");
// });


/**
* Post Routes
*/
// Register route
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const newUser = await User.create({ email, password, username });
    req.logIn(newUser, (err) => {
      if (err) {
        return next(err);
      }
      const token = jwt.sign({ id: newUser._id }, process.env.SECRET, {
        expiresIn: "1h",
      });
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
      return res.status(401).json({ message: "Invalid email or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: "1h",
      });
      res.redirect("/dashboard");
    });
  })(req, res, next);
});



// Logout Route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;