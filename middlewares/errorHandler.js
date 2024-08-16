module.exports = (err, req, res, next) => {
    res.status(err.status || 500).render('error', {
      layout: '../views/layouts/home',
      info: {
        title: err.status,
        description: err.message
      }
    });
  };