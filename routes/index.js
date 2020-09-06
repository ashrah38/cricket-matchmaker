const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const Users = require("../models/users.js");
const connectEnsureLogin = require("connect-ensure-login");
const { reset } = require("nodemon");
const removeSpaces = require("../helper_functions/removeSpaces");
let errorMessage = "";
// GET - home page
router.get("/", (req, res, next) => {
  errorMessage = "";
  res.render("welcome.ejs", { errorMessage });
});

// GET - register page
router.get("/register", (req, res, next) => {
  errorMessage = "";
  res.render("register.ejs", { errorMessage });
});

// POST - register page
router.post("/register", (req, res, next) => {
  // Deconstructing all the variables
  let { firstName, lastName, username, email, password, password2 } = req.body;
  firstName = removeSpaces(firstName);
  lastName = removeSpaces(lastName);
  username = removeSpaces(username);
  email = removeSpaces(email);
  // Validating user information

  if (password !== password2) {
    // Ensuring passwords match
    errorMessage = "Passwords don't match";
    return res.render("register.ejs", {
      firstName,
      lastName,
      username,
      email,
      errorMessage,
    });
  }
  // Checking to see if email is unique
  let flag = true;
  Users.findOne({ email })
    .then((user) => {
      if (user) {
        errorMessage = "Email already in use";
        flag = false;
        return res.render("register.ejs", {
          firstName,
          lastName,
          username,
          email,
          errorMessage,
        });
      }
    })
    .then(() => {
      // Registering a user using passport-local-mongoose method
      if (flag) {
        Users.register({ username, active: false }, password)
          .then((user) => {
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.save().then(() => res.send("Registered"));
          })
          .catch((err) => console.log(err));
      }
    });
});

// GET - login page
router.get("/login", (req, res, next) => {
  res.redirect("/");
});

// POST - Welcome Page (actual verification)
router.post("/", (req, res, next) => {
  const { username, password } = req.body;
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      errorMessage = "Username or Password is incorrect";
      return res.render("welcome.ejs", { errorMessage });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.redirect("/user/home");
    });
  })(req, res, next);
});

module.exports = router;
