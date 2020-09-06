// Searchbar functionality
const mongoose = require("mongoose");
const Users = require("../models/users");
const user = require("../models/users");
const displayFriends = require("./displayFriends.js");

function findFriends(firstName, lastName, username) {
  console.log("running find friends");
  if (username != "") {
    Users.find({ username: username }).then((list) => {
      return list;
    });
  } else if (firstName != "" && lastName == undefined) {
    Users.find({ firstName: firstName }).then((list) => list);
  } else if (firstName != "" && lastName != "") {
    Users.find({ firstName: firstName, lastName: lastName }).then(
      (list) => list
    );
  }
}

module.exports = findFriends;
