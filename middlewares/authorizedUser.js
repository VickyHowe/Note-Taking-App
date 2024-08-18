module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).render("error", {
      info: {
        title: '401',
        description: 'Unauthorized'
      }
    });
  }
};