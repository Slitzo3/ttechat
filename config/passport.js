const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Logger = require('../lib/customLogs');

// Load User model
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          Logger.warn(`Someone tried to login with email: ${email}`);
          return done(null, false, { message: 'That email is not registered' });
        }

        if (!user.activation) {
          Logger.warn(`${email} tried to login, but their account is not activated.`);
          return done(null, false, {
            message: 'Please activate your account first before login in',
          });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            Logger.normal(`${email} logged in correctly.`);
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
