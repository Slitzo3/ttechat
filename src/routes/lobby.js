const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('./lobby/lobby');
});

module.exports = router;
