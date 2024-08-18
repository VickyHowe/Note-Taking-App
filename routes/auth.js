const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

const isAuth = require("../middlewares/authorizedUser").isAuth;



/**
 * @swagger
 *   /auth/google:
 *   get:
 *     summary: Google Login
 *     description: Redirects to Google authentication page
 *     responses:
 *       302:
 *         description: Redirect to Google authentication page
 */
// Google Login Route
router.get(
"/auth/google",
passport.authenticate("google", { scope: ["email", "profile"] })
);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google Login
 *     description: Redirects to Google authentication page
 *     responses:
 *       302:
 *         description: Redirect to Google authentication page
 */
router.get(
"/google/callback",
passport.authenticate("google", {
failureRedirect: "/login",
successRedirect: "/dashboard",
}));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register User
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    res.status(400).send('Email, password, and username are required');
    return next(err);
  }

  try {
    const newUser = await User.create({ email, password, username });
    req.logIn(newUser, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/dashboard");
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
* /login:
*   post:
*     summary: Login to the application
*     description: Authenticates a user and logs them in
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - username
*               - password
*             properties:
*               username:
*                 type: string
*               password:
*                 type: string
*     responses:
*       200:
*         description: User logged in successfully
*       401:
*         description: Invalid username or password
*/
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