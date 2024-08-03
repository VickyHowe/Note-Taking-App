const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {title: "Note Taking App"});
});

module.exports = router;
