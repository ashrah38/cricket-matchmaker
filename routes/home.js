const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const Users = require("../models/users");
const Timings = require("../models/timings");
const connectEnsureLogin = require("connect-ensure-login");

// This route handles the searchbar
router.post(
  "/friends",
  connectEnsureLogin.ensureLoggedIn("/login"),
  (req, res, next) => {
    name = req.body.name;
    const username = req.body.username;
    let firstName = undefined;
    let lastName = undefined;
    if (name != "undefined") {
      const temp = name.split(" ");
      firstName = temp[0];
      lastName = temp[1];
    }
    //Finds the list of people matching attributes
    findFriends(firstName, lastName, username);
    function findFriends(firstName, lastName, username) {
      if (username != "") {
        Users.find({ username: username }).then((list) => {
          return res.send(list);
        });
      } else if (firstName != "" && lastName == undefined) {
        Users.find({ firstName: firstName }).then((list) => {
          return res.send(JSON.stringify(list));
        });
      } else if (firstName != "" && lastName != "") {
        Users.find({ firstName: firstName, lastName: lastName }).then(
          (list) => {
            return res.send(JSON.stringify(list));
          }
        );
      }
    }
  }
);

// This route handles adding a friend to the friend list
router.post(
  "/friends/addfriend/",
  connectEnsureLogin.ensureLoggedIn("/login"),
  (req, res, next) => {
    const username = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    let friendsArray = req.user.friends;
    friendsArray.push({ firstName, lastName, username });
    req.user.save();
    res.redirect("/user/home");
  }
);

// This route handles dynamic availability - returns friendList and availability array
router.get(
  "/availability",
  connectEnsureLogin.ensureLoggedIn("/login"),
  async (req, res, next) => {
    const availability = req.user.availability;
    const friendList = req.user.friends;
    // To obtain the people's array for each id
    res.send(JSON.stringify({ availability, friendList }));
  }
);

// Also for dynamic availability - sends back the timings objects
router.post(
  "/timings",
  connectEnsureLogin.ensureLoggedIn("/login"),
  async (req, res, next) => {
    const id = req.body.id;
    Timings.findOne({ id }).then((object) => res.send(JSON.stringify(object)));
  }
);

// To display schedule for friends
router.post(
  "/schedule/:username",
  connectEnsureLogin.ensureLoggedIn("/login"),
  async (req, res, next) => {
    console.log("Request made");
    const username = req.params.username;
    Users.findOne({ username }).then((user) => {
      let firstName = user.firstName;
      let schedule = user.schedule;
      res.send(JSON.stringify({ firstName, schedule }));
    });
  }
);

// To logout
router.get(
  "/logout",
  connectEnsureLogin.ensureLoggedIn("/login"),
  async (req, res, next) => {
    req.session.destroy();
    res.send("Done");
  }
);

module.exports = router;
