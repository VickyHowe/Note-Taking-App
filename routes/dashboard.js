const express = require("express");
const passport = require("passport");
const router = express.Router();



router.get("/dashboard", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
      res.status(200).json({ message: `Welcome ${req.user.firstName} to the Note Taking Application!` });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });


module.exports = router;
