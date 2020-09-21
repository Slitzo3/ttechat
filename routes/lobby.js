const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Server = require("../models/Servers");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("./lobby/lobby", { users: req.user });
});

router.get("/servers", ensureAuthenticated, async (req, res) => {
  res.render(
    "./lobby/servers",
    { users: req.user, server: await Server.find() },
  );
});

router.get("/voicechat", ensureAuthenticated, async (req, res) => {
  res.render(
    "./lobby/voicechat",
    { users: req.user, server: await Server.find() },
  );
});

router.get("/videochat", ensureAuthenticated, async (req, res) => {
  res.render(
    "./lobby/videochat",
    { users: req.user, server: await Server.find() },
  );
});

module.exports = router;
