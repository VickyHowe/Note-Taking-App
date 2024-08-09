const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require('bcryptjs');
const LocalStrategy = require("passport-local").Strategy;
const flash = require('connect-flash');

router.use(flash());

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: "User not found!" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return done(null, false, { message: "Incorrect password!" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch (err) {
      done(err);
  }
});

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        const googleID = profile.id;
        const email = profile.emails[0].value;
        const displayName = profile.displayName;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const profileImage = profile.photos[0].value;
  
        try {
          let user = await User.findOne({ $or: [{ googleID }, { email }] });
          if (user) {
            // Update user's Google ID if it's not set
            if (!user.googleID) {
              user.googleID = googleID;
              await user.save();
            }
            done(null, user);
          } else {
            const newUser = await User.create({
              googleID,
              email: email,
              username: displayName,
              firstName,
              lastName,
              profileImage,
            });
            done(null, newUser);
          }
        } catch (error) {
          console.log(error);
          done(error, false);
        }
      }
    )
  );
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

// Route if something goes wrong
router.get("/login-failure", (req, res) => {
    res.send("Something went wrong...");
});

// register user page
router.get("/register", (req, res) => {
  res.render("register", { message: req.flash("error") });
});


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

router.get("/login", (req, res) => {
  res.render("login", { message: req.flash("error") });
});

router.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard", { user: req.user });
  } else {
    res.redirect("/login");
  }
});



router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

// Destroy User Session
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;