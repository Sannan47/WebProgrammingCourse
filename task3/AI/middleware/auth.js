// Authentication Middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    // User is logged in, proceed to next middleware/route
    return next();
  } else {
    // User is not logged in, redirect to login page
    return res.redirect('/login.html');
  }
};

module.exports = isAuthenticated;
