module.exports = {
  //Makes sure the user is logged in otherwise will get back to the login route.
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/login');
  },
  //Makes sure those who are logged in can't access the route, only those who aren't singed in session.
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/lobby');
  },
  //Makes sure the user is an admin otherwises gets kicked back to lobby.
  ensureIsAdmin: function (req, res, next) {
    if (req.user.role !== 'admin') {
      res.redirect('/lobby');
    }
    next();
  },
};
