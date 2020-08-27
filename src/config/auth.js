module.exports = {
    ensureAuthenticated: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/users/login');
    },
    forwardAuthenticated: function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/dashboard');
    },
    ensureIsAdmin: function (req, res, next) {
      if (req.user.role !== 'admin') {
        res.redirect('/dashboard');
      }
      next();
    },
  };