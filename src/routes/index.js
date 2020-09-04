const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.get("/", forwardAuthenticated, (req, res) => {
  res.render("getstarted");
});

router.get("/about", forwardAuthenticated, (req, res) => {
  res.render("about");
});

router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register");
});

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

router.get("/forgotpassword", forwardAuthenticated, (req, res) => {
  res.render("forgotpassword");
});

// Register
router.post("/register", forwardAuthenticated, (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!username || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (!regex.test(email)) {
    errors.push({ msg: "Invalid Email" });
  }

  if (errors.length > 0) {
    res.render("register", {
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
          errors.push({ msg: "Username already exists" });
          res.render("register", {
            errors,
            username,
            email,
            password,
            password2,
          });
        } else if (user) {
          errors.push({ msg: "Email already exists" });
          res.render("register", {
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
                  "success_msg",
                  "You are now registered and can log in",
                );
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post("/login", forwardAuthenticated, (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/lobby",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

//Forgot Password
router.get("/forgotpassword", forwardAuthenticated, (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

module.exports = router;
