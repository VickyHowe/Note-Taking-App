const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const jwt = require('jsonwebtoken');




router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username:username });
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        //genereate access token
        const token = jwt.sign({ 
            id: user._id 
        }, 
        process.env.SECRET_KEY, //key to encrypt token
        { 
            expiresIn: '1h' 
        }
        );
        res.status(200).json({message: "Login Successful", token});
    } catch (error) {
        
    }
});

module.exports = router;