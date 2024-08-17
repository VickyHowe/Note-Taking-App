const passport = require("passport");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

/**
 * Passport Local Strategy
 */

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
/**
 * Passport Google Strategy
 */
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

/**
 * Handle Users for Express-Session
 */
// Persist User after Auth
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Retrieve user data from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
