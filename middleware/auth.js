module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next(); // User is authenticated, proceed to the next middleware
  }
  res.redirect('/login'); // Redirect to login if not authenticated
};

module.exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next(); // User is logged in, proceed
  }
  res.redirect('/login?redirect=' + req.originalUrl); // Redirect to login with the intended URL
};