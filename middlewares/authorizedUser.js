module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).render("401", {
      info: {
        title: '401',
        description: 'A Note Taking App'
      }
    });
  }
};