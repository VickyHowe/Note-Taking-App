const express = require("express");
const router = express.Router();
const passport = require("passport");
const Strategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../models/userSchema");


// extract and decrypts jwt token
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
};

// Strategy for Passort Library, check if id valid
passport.use(new Strategy(options, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if (user) {
            return done(null, user); 
        } else {
            return done(null, false); 
        }
    } catch (error) {
        
    }
}));



module.exports = router;
