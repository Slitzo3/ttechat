const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

router.get('/edit', ensureAuthenticated, (req, res) => {
  res.render('./user/edit', {
    users: req.user,
  });
});

router.post('/edit', ensureAuthenticated, (req, res) => {
  const { username, profile, Newpassword, Newpassword2 } = req.body;
  let errors = [];
  let newPassword = [];
  newPassword.password = 'none';

  const newName = username ? username : req.user.username;
  const newProfile = profile != req.user.profilePicture ? profile : req.user.profilePicture;

  if (Newpassword) {
    if (Newpassword === Newpassword2) {
      newPassword.push({
        password: Newpassword,
      });
    } else {
      errors.push({
        msg: "Password doesn't match",
      });
      res.render('./user/edit', {
        errors,
        username,
        email,
        password,
        password2,
      });
    }
  }
  User.findOne({ email: req.user.email }).then((user) => {
    user.username = newName;
    user.profilePicture = newProfile;
    user.password = newPassword.password === 'none' ? user.password : newPassword.password;
    errors.push({
      success_msg: 'Succesfully changed',
    });
    user.save();
  });

  res.render('./user/edit', {
    errors,
    users: req.user,
  });
});

module.exports = router;
