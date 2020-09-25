const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const Activation = require('../models/Activator');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const { resetPasswordEmail } = require('../functions/resetemail');
const Logger = require('../lib/customLogs');
const activationemail = require('../functions/activationemail');

//Where it all started
router.get('/', forwardAuthenticated, (req, res) => {
  res.render('getstarted');
});

//About route
router.get('/about', forwardAuthenticated, (req, res) => {
  res.render('about');
});

//Register route
router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('register');
});

//Login route
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login');
});

//Forgot Password
router.get('/forgotpassword', forwardAuthenticated, (req, res) => {
  res.render('forgotPassword');
});

router.get('/restore/:forgotpasswordkey', forwardAuthenticated, (req, res) => {
  const key = req.params.forgotpasswordkey;
  let errors = [];
  Activation.findOne({ conf: key }).then((dataKey) => {
    if (dataKey != null) {
      res.render('restore', {
        key: key,
      });
    } else {
      errors.push({
        msg: 'Whoops! Something went wrong.. maybe the activation key expired?',
      });
      res.redirect('/forgotpassword', {
        errors,
      });
    }
  });
});

//To activate the account.
router.get('/activation/:key', forwardAuthenticated, (req, res) => {
  const key = req.params.key;
  let errors = [];
  Activation.findOne({ conf: key }).then((data) => {
    if (data != null) {
      if (data.type === 'activate') {
        User.findOne({ email: data.email }).then((user) => {
          user.activation = true;
          user.save();
          errors.push({
            success_msg: 'Account is now activated, feel free to login.',
          });
          Logger.normal(`${user.email} activated their account.`);
          Activation.deleteOne({ conf: key }).then((m) => console.log('Deleted'));
          res.render('login', {
            errors,
          });
        });
      } else {
        errors.push({
          msg: 'Invalid token..',
        });
        res.render('login', {
          errors,
        });
      }
    } else {
      errors.push({
        msg: 'Invalid',
      });
      res.render('login', {
        errors,
      });
    }
  });
});

//Restore the password
router.post('/restore/:key', forwardAuthenticated, (req, res) => {
  const key = req.params.key;
  const { password, password2 } = req.body;
  let errors = [];

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    res.render('restore', {
      errors,
      password,
      password2,
    });
  } else {
    Activation.findOne({ conf: key }).then((dataKey) => {
      if (dataKey != null) {
        User.findOne({ email: dataKey.email }).then((user) => {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user
                .save()
                .then((user) => {
                  req.flash('success_msg', 'Password succesfully changed.');
                  res.redirect('/login');
                })
                .catch((err) => console.log(err));
              Logger.normal(`${user.email} changed their password.`);
            });
          });
        });
      } else {
        errors.push({
          msg: 'Invalid key & Key expired..',
        });
        res.render('restore', {
          errors,
        });
      }
    });
  }
});

// Register
router.post('/register', forwardAuthenticated, (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (!regex.test(email)) {
    errors.push({ msg: 'Invalid Email' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      username,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user != null) {
        if (user.username === username) {
          errors.push({ msg: 'Username already exists' });
          res.render('register', {
            errors,
            username,
            email,
            password,
            password2,
          });
        } else if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            username,
            email,
            password,
            password2,
          });
        }
      } else {
        const newUser = new User({
          username,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  'success_msg',
                  'You are now registered. Please also check your inbox to activate your account.'
                );
                activationemail(email, username, (conf) => {
                  let key = conf.conf;
                  const NewActivation = new Activation({
                    conf: key,
                    email,
                    type: 'activate',
                  });
                  NewActivation.save();
                });
                Logger.normal(`A new user has been created.`);
                res.redirect('/login');
              })
              .catch((err) => Logger.warn(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', forwardAuthenticated, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/lobby',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

//Restore password
router.post('/restore', forwardAuthenticated, (req, res) => {
  const email = req.body.email;
  let errors = [];
  User.findOne({ email: email }).then((user) => {
    if (user != null) {
      const username = user.username;
      resetPasswordEmail(email, username, (conf) => {
        Activation.findOne({ email: email }).then((keyData) => {
          if (keyData != null) {
            errors.push({
              success_msg: `Email sent, please check your inbox for the activation link.`,
            });

            let newKey = new Activation({
              conf: conf.conf,
              email: email,
              type: 'reset',
            });

            newKey.save();

            res.render('forgotPassword', {
              errors,
              email,
            });
            Logger.normal(`${user.email} asked for a new password.`);
          } else {
            errors.push({
              success_msg: `Email sent, please check your inbox for the activation link.`,
            });

            let newKey = new Activation({
              conf: conf.conf,
              email: email,
              type: 'reset',
            });

            newKey.save();

            res.render('forgotPassword', {
              errors,
              email,
            });
          }
        });
      });
    } else {
      errors.push({
        msg: 'No email found.',
      });
      res.render('forgotPassword', {
        errors,
        email,
      });
    }
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;
