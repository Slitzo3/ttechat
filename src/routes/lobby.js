const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Server = require("../models/Servers");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("./lobby/lobby", { users: req.user });
});

router.get("/friends", ensureAuthenticated, (req, res) => {
  res.render("./lobby/friends", { users: req.user });
});

router.get("/servers", ensureAuthenticated, async (req, res) => {
  res.render(
    "./lobby/findServers",
    { users: req.user, server: await Server.find() },
  );
});

router.get("/servers/:id", ensureAuthenticated, (req, res) => {
  res.render("./lobby/servers", { users: req.user, server: {} });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("./lobby/create", { users: req.user });
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  let newServer = new Server({
    name: req.body.name,
  });
  try {
    let serverID = await newServer.save();
    res.redirect(`/servers/${serverID._id}`);
  } catch (err) {
    res.render("/create");
  }
});

module.exports = router;
