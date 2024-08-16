const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Notes = require("../models/notes");
const isAuth = require("../middlewares/authorizedUser").isAuth;


// Load Dashboard
router.get("/dashboard", isAuth, (req, res, next) => {
    res.render("dashboard", {
      user: req.user.username,
      layout: "../views/layouts/dashboardFrame",
      info: {
        title: "Dashboard",
        description: "Dashboard - Note Taking App ",
      },
    });
  });

module.exports = router;
