// const express = require("express");
// const router = express.Router();


// const jwt = require('jsonwebtoken');

// const validateToken = (req, res, next) => {
//   const token = req.cookies['auth-token'];
//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   jwt.verify(token, process.env.SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// // Use the middleware function to validate tokens on every request
// router.use(validateToken);

// module.exports = router;

module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({msg: 'Unauthorized to view resource'});
  }
};