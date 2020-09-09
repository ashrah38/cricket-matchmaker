const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
let errorMessage = "";
let secret = "";

// Setting up nodemailer
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// GET route to the forgot password page
router.get("/forgotpassword", (req, res, next) => {
  errorMessage = "";
  res.render("forgotpassword.ejs", { errorMessage });
});

// POST route - check if email valid
router.post("/forgotpassword", (req, res, next) => {
  const email = req.body.email;
  Users.findOne({ email }).then((user) => {
    if (user) {
      secret = user.email;
      console.log(user.username);
      let token = jwt.sign({ username: user.username }, secret, {
        expiresIn: "24h",
      });
      transporter.sendMail({
        from: "cricketmatchmaker@gmail.com", // sender address
        to: `hamza.ashrafch38@gmail.com`, // list of receivers
        subject: "Password reset", // Subject line
        html: `<b>Please click on the following link in order to reset your password.</b><h5>http://localhost:3000/changepassword/${token}</h5>`, // html body
      });
      return res.render("forgotpassword.ejs", {
        errorMessage:
          "An email has been sent with instructions on how to reset your password",
      });
    } else {
      errorMessage = "No account registered against this email";
      res.render("forgotpassword.ejs", { errorMessage });
    }
  });
});

// GET route for change password page
router.get("/changepassword/:token", (req, res, next) => {
  jwt.verify(req.params.token, secret, (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      console.log(decoded.username);
      res.render("changepassword.ejs", {
        token: req.params.token,
        username: decoded.username,
      });
    }
  });
});

// POST route as to change password
router.post("/changepassword/:token", (req, res, next) => {
  const username = req.body.username;
  jwt.verify(req.params.token, secret, (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      Users.findOne({ username }).then((user) => {
        user.setPassword(req.body.password, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            user.save();
          }
        });
      });
    }
  });
});

module.exports = router;
