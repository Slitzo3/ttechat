const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("./lobby/lobby", { users: req.user });
});

router.get("/friends", ensureAuthenticated, (req, res) => {
  res.render("./lobby/friends", { users: req.user });
});

router.get("/servers", ensureAuthenticated, (req, res) => {
  res.render("./lobby/servers", { users: req.user });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("./lobby/create", { users: req.user });
});

module.exports = router;
