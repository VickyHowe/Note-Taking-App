const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
// const { LoggedIn } = require('../middlewares/checkAuth');

router.post("/register", async (req, res) => {
    const { username, password, firstName, lastName } = req.body;
    try {
        const newUser = await User.create({
            username,
            password,
            firstName,
            lastName
        });
    res.status(201).json({
        message: "New User Created!",
        user: newUser
    });
    } catch (error) {
       res.status(500).json({
        message: "Error Creating User",
        error: error
       }); 

    }
});


module.exports = router;